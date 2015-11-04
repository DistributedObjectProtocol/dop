



//////////  src/syncio.js


module.exports = syncio = {
    version: '1.0.0',
    name: 'syncio',
    port: 4444,
    side: 'user',
    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    key_remote_function: '~F',
    on: {},
};






//////////  src/core/api.js


syncio.api = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = syncio.ws;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: syncio.on.open.bind( this ),

        message: syncio.on.message.bind( this ),

        close: syncio.on.close.bind( this )

    };


    this.objects_original = {};

    this.objects = {};
    this.object_id = 1;

    this.users = {};
    this.user_id = 1;

    this.requests = {};
    this.request_id = 1;

    this.key_remote_function = syncio.key_remote_function;
    
    this.connector = this[options.connector.name_connector] = options.connector( options, on );

    this.observe = syncio.observe.bind(this);

};


syncio.api.prototype = Object.create( require('events').EventEmitter.prototype );






//////////  src/core/configure.js

// ?????
syncio.configure = function( object, path, isobservable ) {

    var that = this;

    Object.defineProperty( object, syncio.key_object_path, {value: path} );

    if ( isobservable )
        Object.observe( object, this.observe );

    syncio.path( object, function(subpath, value, key, obj ) {
        
        var newpath = path.concat(subpath);

        if ( value === that.key_remote_function )
            obj[key] = syncio.create_remote_function.call( that, newpath );

        if ( value !== null && typeof value == 'object' ) {
        
            Object.defineProperty( value, syncio.key_object_path, {value: newpath} );
            
            if ( isobservable )
                Object.observe( value, that.observe );

        }

    });

};




/*

syncio.api.prototype.observe = function(changes) {

    for (var i=0; i<changes.length; i++) {
        
        var path = changes[i].object._path.slice(0);
        path.push( changes[i].name )

        if (
            (changes[i].type == 'update' || changes[i].type == 'add') &&
            changes[i].object[changes[i].name] !== null &&
            typeof changes[i].object[changes[i].name] == 'object'
        ) {
            syncio.observe(changes[i].object[changes[i].name], tcallback_observer, path );
        }

        console.log( changes[i].type, path, changes[i].oldValue );
        console.log()

    }

};




// setTimeout(function(){

MYSERVE = new syncio.instance();
MYOBJECT = {
    foo: 0,
    bar: 1,
    obj: {
        paco: 2,
        pil: 3,
        arr: [1,2,3,4]
    }
};

syncio.observe(MYOBJECT, MYSERVE.observe.bind(MYSERVE), [12345] );

MYOBJECT.obj.arr[2] = 'ONE';
MYOBJECT.obj.arr = 'TWO';
MYOBJECT.foo = 'THREE';
MYOBJECT.bar = 'FOUR';
// delete MYOBJECT.obj.arr;
MYOBJECT.obj.arr = [1,2,3,{paco:'pil'}];
setTimeout(function(){
    console.log('reobserve')
    MYOBJECT.obj.arr[3].paco = 'porras';
},1)


// },5000)
*/




//////////  src/core/create.js


syncio.create = function( options ) {

    return new syncio.api( options );

};




//////////  src/core/create_remote_function.js

// Create a remote function
syncio.create_remote_function = function ( path ) {

    var that = this;
    return function syncio_remote_function() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new Function(
    //     "return function " + that.key_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};




//////////  src/core/error.js


syncio.error = {

    // REQUEST_UNIQUE: 'The id of the request should be unique (incrementing numericaly) for every request',

	SYNC_MUST_BE_OBJECT: 'The property "object" of the method sync() only accept Object, Array or Function. If is a function the response() must be a Object or an Array',
	SYNC_NO_REPEAT: 'You can not sync the same object with different names',
	SYNC_NO_INNER: 'Syncio can not sync objects that are inside into another objects already synced'
};




//////////  src/core/errorserver.js


syncio.error.client = {
    OBJECT_NOT_FOUND: -1,
    ALREADY_SYNCED: -2,
};


syncio.error.server = {
    '-1': 'Object "{{2}}" not found',
    '-2': 'You are already synced to the object "{{2}}"',
};




//////////  src/core/observe.js


syncio.observe = function(changes) {

    for (var i=0; i<changes.length; i++) {
        
        var path = changes[i].object[syncio.key_object_path].slice(0);
        
        path.push( changes[i].name );

        if (
            (changes[i].type == 'update' || changes[i].type == 'add') &&
            changes[i].object[changes[i].name] !== null &&
            typeof changes[i].object[changes[i].name] == 'object'
        ) {
            syncio.configure.call(this, changes[i].object[changes[i].name], path, true );
        }

        // console.log( changes[i].type, path, changes[i].oldValue );
        // console.log()

    }

};





//////////  src/core/osp.js


syncio.osp = function( user, messages ) {


    if (typeof messages[0] != 'object')
        messages = [messages];


    // Managing all messages one by one
    for (var i=0, t=messages.length, request, request_id, action; i<t; i++) {

        request = messages[i];
        request_id = request[0];
        action = request[1];

        // If is a number we manage the OSP request
        if ( typeof request_id == 'number' ) {

            // REQUEST ===============================================================
            if (request_id > 0) {

                switch( action ) {

                    case syncio.protocol.connect:
                        syncio.on.connect.call( this, user, request );
                        break;

                    case syncio.protocol.request:
                        syncio.on.request.call( this, user, request );
                        break;

                    case syncio.protocol.sync:
                        syncio.on.sync.call( this, user, request );
                        break;

                }

            }

            // RESPONSE ===============================================================
            else {

                request_id *= -1;

                if ( user.requests[ request_id ] !== null && typeof user.requests[ request_id ] == 'object' ) {

                    switch( action ) {

                        case syncio.protocol.connect:
                            syncio.on._connect.call( this, user, request );
                            break;

                        case syncio.protocol.request:
                            syncio.on._request.call( this, user, request, request_id, action );
                            break;

                        case syncio.protocol.sync:
                            syncio.on._sync.call( this, user, request );
                            break;

                        default:
                            syncio.on.reject.call( this, user, request, request_id, action );

                    }

                    // Removing request
                    delete user.requests[request_id];

                }

            }

        }

    }

};




//////////  src/core/parse.js


syncio.parse = function( data ) {

    return JSON.parse( data, syncio.parse_callback );

};

syncio.parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse
syncio.parse_callback = function (k, v) {
        
    //http://jsperf.com/serializing-date-on-json-parse
    if ( typeof v === 'string' ) {
        var regexp = syncio.parse_type_date.exec(v);
        if ( regexp )
            return new Date(v);
    }

    return v;

};




//////////  src/core/protocol.js


syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array
    // [[<request_one>, <action>, <params...>], [<request_two>, <action>, <params...>]]

    // If the response have a number greater than -1 as second parameter and is the same value than the request, means the response it's fulfilled
    // [-1234, 2, <params...>]

    // If the response have a second parameter defined as number less than 0 means is an error on any case of 
    // the requests's bellow, The number of the error is negative so to get the corret code_error we must make it positive
    // [-1234, -23]   -> -23 * -1 == code_error

    // Also the error response could be custom if is an string
    // [-1234, 'My custom message error']

    // You can always pass more extra parameters on any requests
    // [ 1234, 2, <user_token>, <extra_params...>]



                        // Client
    connect: 0,         // [ 1234, 0]
                        // [-1234, 0, <user_token>, '~F']


    request: 1,         // [ 1234, 1, [<params...>]]
                        // [-1234, 1, [<params...>]]



    sync: 2,            // Server
                        // [ 1234, 2, <object_id>, <writable 0|1>, <data_object>, <name>]
                        // [-1234, 2]
                        // Client
                        // [ 1234, 2, <name>]
                        // [-1234, 2, <object_id>, <writable 0|1>, <data_object>]


    unsync: 3,          // [ 1234, 3, <object_id>]
                        // [-1234, 3]


    call: 4,            // [ 1234, 4, <object_id>, ['path','path'], [<params...>]]
                        // [-1234, 4, [<params...>]]


    set: 5,             // [ 1234, 5, <object_id>, ['path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 5, <object_id>, ['path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 5]



};







//////////  src/core/reject.js


syncio.reject = function() {

    return syncio.response( 'reject', arguments );

};




//////////  src/core/request.js

// Create a new request
syncio.request = function ( request_data ) {

    var request_id = this.request_id++;
    request_data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: request_data, 
        promise: new syncio.promise()
    };

};




//////////  src/core/resolve.js


syncio.resolve = function() {

    return syncio.response( 'resolve', arguments );

};




//////////  src/core/response.js


syncio.response = function( action, params ) {

    var promise;

    return syncio.arguments( params, function( args ) {

        promise = args[args.length-1];

        if (promise && typeof promise == 'object' && typeof promise.resolve == 'function' && typeof promise.reject == 'function' && typeof promise.response == 'object' && promise.resolved !== true) {
            promise[action].apply( promise, params );
            promise.resolved = true;
            return true;
        }
        else
            return false;

    });

};

syncio.response.resolve = function() {

    this.response.push( Array.prototype.slice.call( arguments, 0 ) );

    this.user.send( syncio.stringify( this.response ) );

};

syncio.response.reject = function( error ) {

    this.response[1] = error;

    this.user.send( syncio.stringify( this.response ) );

};









// function fun( a, b ) {

//     return (function() {
//         return (function() {
//              return syncio.resolve( a*b );
//         })();
//     })();

// }


// var o={
//     reject: function(){},
//     response: {},
//     resolve: function syncio_resolve( result ){
//         console.log('resolved1', result);
//     }
// };
// var o2={
//     reject: function(){},
//     response: {},
//     resolve: function syncio_resolve( result ){
//         console.log('resolved2', result);
//     }
// };

// console.log(2, fun(5,5, o) );
// console.log(3, fun(5,5, o) );






//////////  src/core/stringify.js


syncio.stringify = function( data ) {

    var key_remote_function = this.key_remote_function;

    return JSON.stringify( data, function (k, v){

        if ( typeof v == 'function' && v.name !== key_remote_function )
            return key_remote_function;
        
        return v;
    });

};




//////////  src/core/user.js


syncio.user = function( syncio, user_socket, user_id ){

    this.syncio = syncio;
    this.socket = user_socket;
    this.writables = {};
    this.objects = {};
    this.requests = {};
    this.token = (user_id).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator
             // (this.user_id++).toString(36) + (Math.random() * Math.pow(10,18)).toString(36)  // http://jsperf.com/token-generator-with-id
             //  Number((this.user_id++) + "" + (Math.random() * Math.pow(10,18))).toString(36)

};




//////////  src/api/sync.js


syncio.api.prototype.sync = function( name, options ) {

    if (typeof options != 'object')
        options = {};

    if (options.object == null || (typeof options.object != 'object' && typeof options.object != 'function'))
        throw new TypeError( syncio.error.SYNC_MUST_BE_OBJECT );

    if (typeof options.writable == 'undefined')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable == 'undefined')
        options.observable = (typeof Object.observe == 'function'); // observe changes with Object.observe

    this.objects_original[name] = options;

};




//////////  src/on/_connect.js


syncio.on._connect = function _connect() {

    // nothing here because OSP protocol does not allow this

};




//////////  src/on/_request.js


syncio.on._request = function _request( user, request ) {

    this.requests[ request[0]*-1 ].promise.resolve.apply( this, request[2] );

    this.emit( '_request', request );

};




//////////  src/on/close.js


syncio.on.close = function close( user_socket ){

    var user = this.users[ user_socket[syncio.key_user_token] ];

    this.emit( 'close', user );

    for ( var object_name in user.objects ) {

        // Remove object
        if (
            this.objects[ user.objects[object_name][syncio.key_object_path][0] ].subscribed == 1 && // The object only have had one subscribed
            this.objects_original[object_name].object !== user.objects[object_name] // Original object is different to the object
        )
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ];


        // Remove user listener from the object
        else
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ].users[ user.token ];

    }

    // Remove user
    delete this.users[ user.token ];

};




//////////  src/on/connect.js


syncio.on.connect = function connect( user_socket, request ) {

    var response = [request[0] * -1],
        user = new syncio.user( this, user_socket, this.user_id++ );

    user_socket[ syncio.key_user_token ] = user.token;

    // Setup server for new user
    this.users[ user.token ] = user;

    response.push( syncio.protocol.connect, user.token );

    if ( this.key_remote_function !== syncio.key_remote_function )
        response.push( this.key_remote_function );
    

    this.emit( 'connect', user, request, response );

    user.send( JSON.stringify( response ) );

};




//////////  src/on/message.js


syncio.on.message = function message( user_socket, message_raw ) {

    var messages, 
        user = (typeof user_socket[syncio.key_user_token] == 'undefined' ) ?
            user_socket
        :
            this.users[ user_socket[syncio.key_user_token] ];

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = syncio.parse( message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', user, messages, message_raw );


    // Managing OSP protocol
    if ( syncio.typeof( messages ) == 'array' )
        syncio.osp.call( this, user, messages );

};




//////////  src/on/open.js


syncio.on.open = function open( user_socket ){

    this.emit( 'open', user_socket );

};




//////////  src/on/request.js


syncio.on.request = function request( user, request ) {

    var response = [ request[0] * -1, request[1] ];

    var promise = { request: request, response: response, user: user };
    promise.resolve = syncio.response.resolve.bind( promise );
    promise.reject = syncio.response.reject.bind( promise );

    var params = [ 'request' ];
    params = params.concat( request[2] );
    params.push(promise);

    this.emit.apply(this, params );

};




//////////  src/on/sync.js


syncio.on.sync = function sync( user, request ) {

    var response = [ request[0] * -1 ];
    var object_name = request[2];

    // // If Object not found
    // if (typeof this.objects_original[object_name] != 'object') {
    //     response.push( syncio.error.client.OBJECT_NOT_FOUND );
    //     syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
    // }

    // // If the user already is subscribed to this object
    // else if ( typeof user.objects[object_name] == 'object' ) {
    //     response.push( syncio.error.client.ALREADY_SYNCED );
    //     syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
    // }

    // else {

        response.push( request[1] );

        var sync_object = function( object ) {

            // object must be an array or object
            if ( object == null || typeof object != 'object' )
                throw new TypeError( syncio.error.SYNC_MUST_BE_OBJECT );



            // If the object already exists
            if ( syncio.typeof( object[syncio.key_object_path] ) == 'array' ) {

                // we get the object_id
                var object_id = object[syncio.key_object_path][0];

                if ( typeof this.objects[object_id] == 'object' ) {

                    // Checking if the object is already synced with other name
                    if( this.objects[object_id].name !== object_name )
                        throw new TypeError( syncio.error.SYNC_NO_REPEAT );

                    this.objects[object_id].subscribed += 1;

                }

                // // Checking if the object is inside into another object already synced
                // else if ( object[syncio.key_object_path].length > 1 && object === syncio.getset(
                //         this.objects[object[syncio.key_object_path][0]].object,
                //         object[syncio.key_object_path].slice(1)
                //     ) 
                // )
                //     throw new TypeError( syncio.error.SYNC_NO_INNER );

            }


            // If the object doesn't exist yet
            else {

                var object_id = this.object_id++,
                    path = [object_id];


                syncio.configure.call(
                    this,
                    object, 
                    path, 
                    this.objects_original[object_name].observable
                );

            }



            // Storing object
            if ( typeof this.objects[object_id] != 'object' || this.objects[object_id].object !== object )
                this.objects[ object_id ] = {object:object, name:object_name, users:{}, subscribed:1}; // users is an objects of the users than are subscribed to this object

            // Setting the object to the user
            user.objects[object_name] = object;

            // Set to the user if the object is writable for him or not
            user.writables[object_name] = this.objects_original[object_name].writable;

            // Adding the user as subscriber of this object
            this.objects[ object_id ].users[ user.token ] = true; 
            
            // Forming the response
            response.push(
                object_id,
                user.writables[object_name]*1, // false*1 === 0
                object
            );

            // Sending response
            user.send( syncio.stringify(response) );

        };

        // Getting the object
        ( typeof this.objects_original[object_name].object == 'function' ) ?
            this.objects_original[object_name].object( user, request, sync_object.bind(this) )
        :
            sync_object.call( this, this.objects_original[object_name].object );

    // }

};




//////////  src/user/close.js


syncio.user.prototype.close = function() {
    return this.socket.close();
};




//////////  src/user/request.js

// Send a new request
syncio[syncio.side].prototype.request = function () {

    var data = [ syncio.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = syncio.request.call( this.syncio, data );

    this.send( syncio.stringify( request.data ) );

    return request.promise;
    
};




//////////  src/user/send.js


syncio.user.prototype.send = function( message ) {
    return this.socket.send( message );
};




//////////  src/util/arguments.js

// This method find arguments from inside to outside, and if the callback return true will stop
syncio.arguments = function( args, callback ) {

    var finder = args;

    while ( typeof finder.callee.caller == 'function' ) {

        if ( callback( finder.callee.caller.arguments ) )
            return args[0];

        else
            finder = finder.callee.caller.arguments;

    }

    return args[0];
    
};





//////////  src/util/getset.js


syncio.getset = function(obj, path, value) {

    if (path.length == 0)
        return obj;

    for (var i = 0; i<path.length-1; i++)
        obj = obj[ path[i] ];


    if ( arguments.length > 2 )
        obj[ path[i] ] = value;


    return obj[ path[i] ];

};





//////////  src/util/merge.js

// Based on: https://github.com/unclechu/node-deep-extend (Performace: http://jsperf.com/deepmerge-comparisions/3)
syncio.merge = (function() {

    return function merge(first, second) {

        var args = arguments,
            key, val, src, clone;

        if (args.length < 2) return first;

        if (args.length > 2) {
            // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
            Array.prototype.splice.call(args, 0, 2, merge(first, second));
            // Recursion
            return merge.apply(this, args);
        }


        for (key in second) {

            if (!(key in second)) continue;

            src = first[key];
            val = second[key];

            if (val === first) continue;

            if ( (typeof val != 'object' && !Array.isArray(val)) || val instanceof Date ) {
            //if (!first.hasOwnProperty(key) || (typeof val !== 'object' && !Array.isArray(val))) {
                first[key] = val;
                continue;
            }


            if ( typeof src !== 'object' || src === null ) {
                clone = (Array.isArray(val)) ? [] : {};
                first[key] = merge(clone, val);
                continue;
            }


            clone = (Array.isArray(val)) ?

                (Array.isArray(src)) ? src : []
            :
                (!Array.isArray(src)) ? src : {};



            first[key] = merge(clone, val);
        }

        return first;
    }

})();


// // Based in syncio.path && syncio.getset
// syncio.merge = (function() {

//     var destiny;

//     function callback(path, value){

//         if ( value && typeof value == 'object' )

//             value = (Array.isArray( value )) ? [] : {};

//         syncio.getset(destiny, path, value);

//     };

//     return function merge(first, second) {

//         var args = arguments;

//         if (args.length > 2) {
//             // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
//             Array.prototype.splice.call(args, 0, 2, merge(first, second));
//             // Recursion
//             return merge.apply(this, args);
//         }

//         destiny = first;

//         syncio.path(second, callback);

//         return first;

//     };

// })();



// var obj1 = {
//     a: 11,
//     b: 12,
//     array: [1,2,3,{abc:123}],
//     d: {
//         d1: 13,
//         d2: {
//             d21: 123,
//             d22: {
//                 d221: 12,
//                 d223: { 
//                   hola: 'hola',
//                   static: 'static'
//                 }
//             }
//         }
//     },
//     f: 5,
//     g: 123
// };
// var obj2 = {
//     b: 3,
//     c: 5,
//     obj: {lolo:111},
//     fun: function(){},
//     arr: [1,2,3,{La:123}],
//     array: [567],
//     d: {
//         d2: {
//             d22: {
//                 d222: 25,
//                 d223: {
//                   hola:'mundo'
//                 }
//             }
//         }
//     },

// };

// //r=syncio.merge2(obj2,obj1)
// r=Object.assign({},obj2);
// console.log( r );
// console.log( r.obj === obj2.obj );
// console.log( r.fun === obj2.fun );
// console.log( r.arr === obj2.arr );


// r2=merge({},obj2);
// console.log( r2 );
// console.log( r2.obj === obj2.obj );
// console.log( r2.fun === obj2.fun );
// console.log( r2.arr === obj2.arr );








//////////  src/util/path.js

// http://jsperf.com/stringify-path-vs-custom-path/2 - http://jsperf.com/stringify-path-vs-custom-path/3
syncio.path = function (obj, callback) {

    syncio.path.recursive.call({circular:[]}, obj, callback, []);

};
syncio.path.recursive = function (obj, callback, path ) {

    for (var key in obj) {

        //if ( obj.hasOwnProperty(key) ) {
        
            path.push( key );

            if ( this.stop == false )
                return;

            this.stop = callback(path, obj[key], key, obj);

            // Avoiding circular loops
            if ( obj[key] && typeof obj[key] == "object" && obj[key] !== obj && this.circular.indexOf(obj[key])==-1 ) {

                this.circular.push(obj[key]);

                syncio.path.recursive.call(this, obj[key], callback, path );

            }

            path.pop();

        //}

    }

};



// // http://jsperf.com/stringify-clousured-or-not - 
// syncio.stringify_path = function(obj, callback) {

//     var path = [];

//     return JSON.stringify(obj, function(k,v){

//         if (v !== obj) {

//             while ( path.length>0 && syncio.getset(obj, path) !== this )
//                 path.pop();

//             path.push(k);

//         }

//         return (typeof callback == 'function') ? callback.call(this, k, v, path) : v;

//     });

// };




//////////  src/util/promise.js


syncio.promise = function( resolver ) {

    var thens = [];
    var state = 0; /* 0 = pending, 1 = fulfilled, 2 = rejected */
    var type, type_variable;
    
    // this._chain = 0;


    this.then = function(onFulfilled, onRejected) {

        if (typeof onFulfilled == 'function')
            thens.push([onFulfilled]);
        if (typeof onRejected == 'function')
            thens.push([undefined, onRejected]);

        return this;
        // if ( this._chain )
        //     var that = this;
        // else{
        //     var that = Object.create(this);
        //     that._chain = 0;
        // }

        // that._chain++;
        // return that;
    };


    this.catch = function(onRejected) {
        return this.then(0, onRejected);
    };

    this.resolve = function() {
        if (state != 0) { return this; }
        type = this.type = 0;
        state = 1;
        schedule.call(this, 0, arguments);
    };

    this.reject = function() {
        if (state != 0) { return this; }
        type = this.type = 1;
        state = 2;
        schedule.call(this, 0, arguments);
    };

    var schedule = function(i, values) {
        setTimeout(function(){
            loop.call(this, i, values);
        }.bind(this),0);
    };

    var loop = function( i, values ) {

        var iplus = i+1;

        if ( typeof thens[i] == 'object' && typeof thens[i][this.type] == 'function' ) {

            try {
                values = [thens[i][this.type].apply(
                    ( thens[i][this.type].hasToGoUp ) ? this : undefined, // 2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value).
                    values
                )];

                if (this.type && !type)
                    this.type = 0;
            }
            catch (e) {
                this.type = 1;
                values = [e];
            }



            // 2.3.1. If promise and x refer to the same object, reject promise with a TypeError as the reason.
            if (values[0] === this) {
                this.type = 1;
                values[0] = new TypeError("Promise resolved by its own instance");
            }

            // 2.3.2. If x is a promise, adopt its state 
            else if ( values[0] instanceof this.constructor ) {
                (function(that, _i, _promise) {
                    var goingup = function(){
                        that.type = this.type;
                        loop.call(that, _i, arguments);
                    };
                    goingup.hasToGoUp = true;
                    _promise.then(goingup, goingup);
                })(this, iplus, values[0]);
                return;
            }

            /*
            // 2.3.3: Otherwise, if `x` is an object or function
            else if ( values[0] !== null && (typeof values[0] == 'object' || typeof values[0] == 'function') ) {

                try {
                    // 
                    var then = values[0].then;
                    console.log(typeof then)
                } catch (e) {
                    // 2.3.3.2. If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
                    values[0] = e;
                    return this.loop.call(this, iplus, values);
                }

                if ( typeof then == 'function' ) {
                    // 2.3.3.3. If then is a function, call it
                    var called = false;
                    var resolvePromise = function(y) {
                    // console.log(iplus, values)
                        // 2.3.3.3.1. If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                        if (called) { return; }
                        called = true;
                        return loop.call(this, iplus, values);
                    }
                    var rejectPromise = function(r) {
                    // console.log(22222)
                        // 2.3.3.3.2. If/when rejectPromise is called with a reason r, reject promise with r.
                        if (called) { return; }
                        called = true;
                        this.type = 1;
                        return loop.call(this, iplus, values);
                    }

                    try {
                        then.call(values[0], resolvePromise.bind(this), rejectPromise.bind(this));
                    } catch (e) { // 2.3.3.3.4. If calling then throws an exception e,
                        // console.log(333333)
                        // 2.3.3.3.4.1. If resolvePromise or rejectPromise have been called, ignore it.
                        if (called) { return; }
                        // 2.3.3.3.4.2. Otherwise, reject promise with e as the reason.
                        this.type = 1;
                        return loop.call(this, iplus, values);
                    }

                }

            }
            */

        }

        // Next .then()
        if ( iplus < thens.length )
            loop.call(this, iplus, values);

    };


    if ( typeof resolver == 'function' )
        resolver( 
            this.resolve.bind(this),
            this.reject.bind(this)
        );

};

// Need it for Promises/A+ specifications
syncio.promise.resolve = function(value) {
    return new this(function(resolve) {
        resolve(value);
    });
};

// Need it for Promises/A+ specifications
syncio.promise.reject = function(reason) {
    return new this(function(resolve, reject) {
        reject(reason);
    });
};








//////////  src/util/typeof.js


syncio.typeof = function(value) {

    var s = typeof value;

    if ( s == 'object' ) {
        if (value) {
            if (value instanceof Array)
                s = 'array';
        }
        else
            s = 'null';
    }
    return s;

};


/*
syncio.typeof = (function() {
    
    var list = {

        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object Object]': 'object',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Boolean]': 'boolean',
        '[object Symbol]': 'symbol'

    };


    return function ( type ) {

        return list[ Object.prototype.toString.call( type ) ];

    };


})();
*/






//////////  src/connector/socketio.js

// http://socket.io/docs/server-api/
syncio.socketio = function ( options, on ) {

    options.connector = options._connector; // Need it because socketio accept the option connector as parameter natively

    var that = new syncio.socketio.api( options.httpServer, options );

    if (typeof options.httpServer == 'undefined') {

        if (typeof options.port != 'number')
            options.port = syncio.port;

        that.listen( options.port );

    }

    that.of( options.namespace ).on('connection', function( user ){

        user.emit('open');

        user.on('message', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

        user.send = syncio.socketio.send;

        user.close = syncio.socketio.close;

        on.open( user );

    });


    return that;

};

syncio.socketio.api = require('socket.io');
syncio.socketio.name_connector = 'socketio';

syncio.socketio.send = function( data ) {
    this.emit('message', data);
};
syncio.socketio.close = function( data ) {
    this.disconnect();
};



/*

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/








//////////  src/connector/sockjs.js

// https://github.com/sockjs/sockjs-node
syncio.SockJS = function ( options, on ) {

    if (typeof options.httpServer == 'undefined')
        throw Error('The connector SockJS needs the parameter httpServer passed in the options');

    options.prefix = options.namespace;

    var that = syncio.SockJS.api.createServer( options );

    that.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.send = syncio.SockJS.send;

        on.open( user );

    });

    that.installHandlers( options.httpServer, options );

    return that;

};

syncio.SockJS.api = require('sockjs');
syncio.SockJS.name_connector = 'SockJS';

syncio.SockJS.send = function( data ) {
    this.write( data );
};



/*

Url-Server: /syncio
Url-Client: /syncio

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/







//////////  src/connector/ws.js

// https://github.com/websockets/ws
syncio.ws = function ( options, on ) {

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var that = new syncio.ws.api.Server( options );

    that.on('connection', function( user ){

        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        on.open( user );

    });


    return that;

};

syncio.ws.api = require('ws');
syncio.ws.name_connector = 'ws';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



