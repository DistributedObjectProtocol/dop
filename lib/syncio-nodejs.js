



//////////  src/syncio.js


module.exports = syncio = {
    version: '0.2.4',
    name: 'syncio',
    port: 4444,
    side: 'user',
    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    key_remote_function: '~F',
    on: {},
    _on: {},
    user_inc: 0,
    objects: {},
    object_inc: 0
};






//////////  src/core/api.js


syncio.api = function( options ) {

    if (syncio.typeof(options) != 'object')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = syncio.ws;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;

    if (typeof options.key_remote_function != 'string')
        options.key_remote_function = syncio.key_remote_function;


    var on = {

        open: syncio.on.open.bind( this ),

        message: syncio.on.message.bind( this ),

        close: syncio.on.close.bind( this )

    };


    this.objects = {};
    this.object_id = 0;

    this.users = {};
    this.user_inc = 0;

    this.requests = {};
    this.requests_inc = 1;

    this.key_remote_function = options.key_remote_function;
    
    this.connector = this[options.connector.name_connector] = options.connector( options, on );

    this.observe = syncio.observe.bind(this);

};


syncio.api.prototype = Object.create( require('events').EventEmitter.prototype );






//////////  src/core/configure.js

// Configure a new object with the remote callbacks ~PATH and observe if is observable
syncio.configure = function( object, path, isobservable ) {

    var that = this;

    Object.defineProperty( object, syncio.key_object_path, {value: path} );

    // if ( isobservable )
        // Object.observe( object, this.observe );

    syncio.path( object, function(subpath, value, key, obj ) {

        var newpath = path.concat(subpath);

        if ( value === that.key_remote_function )
            obj[key] = syncio.create_remote_function.call( that, newpath );

        if ( value !== null && typeof value == 'object' && typeof value[syncio.key_object_path] == 'undefined' ) {
        
            Object.defineProperty( value, syncio.key_object_path, {value: newpath} );
            
            // if ( isobservable )
                // Object.observe( value, that.observe );

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
    return function $syncio_remote_function() {

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

    SYNC_MUST_BE_OBJECT: 'The property "object" of the method sync() only accept Objects',
    SYNC_NO_REPEAT_NAME: 'You can not sync different objects with the same name',
    SYNC_NO_INNER: 'Syncio can not sync objects that are inside into another objects already synced',

    REJECT_CALL_NOT_EXISTS: 'You are trying to call a function does not exists',

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
            if (request_id > 0 && typeof syncio.on[syncio.protocol_keys[action]] == 'function' )
                syncio.on[syncio.protocol_keys[action]].call( this, user, request );


            // RESPONSE ===============================================================
            else {

                request_id *= -1;

                if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                    if ( typeof syncio._on[syncio.protocol_keys[action]] == 'function' )
                        syncio._on[syncio.protocol_keys[action]].call( this, user, request );

                    else
                        syncio.on.reject.call( this, user, request );

                    // Removing request
                    if ( --this.requests[request_id].users === 0 )
                        delete this.requests[request_id];

                }

            }

        }

    }

};




//////////  src/core/parse.js

(function() {

    syncio.api.prototype.parse = function( data ) {

        return JSON.parse( data, parse_callback );

    };

    var parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse
    var parse_callback = function (k, v) {
            
        //http://jsperf.com/serializing-date-on-json-parse
        if ( typeof v === 'string' ) {
            var regexp = parse_type_date.exec(v);
            if ( regexp )
                return new Date(v);
        }

        return v;

    };

})();




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
                        // [-1234, 2, <data_object_merged>]


    unsync: 3,          // [ 1234, 3, <object_id>]
                        // [-1234, 3]


    call: 4,            // [ 1234, 4, [<object_id>, 'path','path'], [<params...>]]
                        // [-1234, 4, [<params...>]]


    set: 5,             // [ 1234, 5, [<object_id>, 'path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 5, [<object_id>, 'path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 5]



};


syncio.protocol_keys = {};
for (var key in syncio.protocol)
    syncio.protocol_keys[ syncio.protocol[key] ] = key;







//////////  src/core/reject.js


syncio.reject = function() {

    return syncio.response( 'reject', arguments );

};




//////////  src/core/request.js

// Create a new request
syncio.request = function ( request_data ) {

    var request_id = this.requests_inc++;
    request_data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: request_data, 
        promise: new syncio.promise(),
        users: 1
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

    this.user.send( this.user.syncio.stringify( this.response ) );

};

syncio.response.reject = function( error ) {

    this.response[1] = error;

    this.user.send( this.user.syncio.stringify( this.response ) );

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


syncio.api.prototype.stringify = function( data ) {

    var key_remote_function = this.key_remote_function;

    return JSON.stringify( data, function (k, v){

        if ( typeof v == 'function' && v.name !== '$syncio_remote_function' )
            return key_remote_function;
        
        return v;
    });

};




//////////  src/core/user.js


syncio.user = function( syncio, user_socket ){

    this.syncio = syncio;
    this.socket = user_socket;
    this.writables = {};
    this.objects = {};
    this.token = ( syncio.user_inc++ ).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator
             // (this.user_inc++).toString(36) + (Math.random() * Math.pow(10,18)).toString(36)  // http://jsperf.com/token-generator-with-id
             //  Number((this.user_inc++) + "" + (Math.random() * Math.pow(10,18))).toString(36)

};




//////////  src/api/call.js

// Send a new request
syncio.api.prototype.call = function( path, params ) {

    var token, 
        users_n = 0, 
        users = syncio.objects[path[0]].users,
        data = [ syncio.protocol.call, path, params ],
        request = syncio.request.call( this, data ),
        data_string = this.stringify( request.data );

    for (token in users) {
        users_n += 1;
        users[token].send( data_string );
    }

    request.users = users_n;

    return request.promise;
    
};




//////////  src/api/remote.js


syncio.api.prototype.remote = function() {
    return this.key_remote_function;
};




//////////  src/on/_call.js


syncio._on.call = function( user, response ) {

    var request_id = response[0]*-1;
    
    if (this.requests[ request_id ].users === 1 )
        this.requests[ request_id ].promise.resolve.apply( user, response[2] );
    else
        this.requests[ request_id ].promise.multiresolve.apply( user, response[2] );

};




//////////  src/on/_request.js


syncio._on.request = function( user, response ) {

    this.requests[ response[0]*-1 ].promise.resolve.apply( this, response[2] );

};




//////////  src/on/_sync.js


syncio._on.sync = function( user, response ) {

    var request_id = response[0]*-1,
        object_id = this.requests[ request_id ].data[2],
        object_name = this.requests[ request_id ].data[5],
        object_remote = response[2],
        object = syncio.objects[ object_id] .object;



    // If the object is writable and the response has an object to merge
    if ( user.writables[object_name] && typeof object_remote == 'object' ) {

        syncio.merge( object_remote, object );

        syncio.merge( object, object_remote );

        syncio.configure.call(this, object, object[syncio.key_object_path] );

    }

    this.requests[ request_id ].promise.resolve( object, object_id );

};




//////////  src/on/call.js


syncio.on.call = function( user, request ) {
    
    var response = [ request[0] * -1 ];

    if (syncio.typeof( request[2] ) == 'array' ) {
        
        var path = request[2],
            object_id = path.shift();
    
        if ( typeof syncio.objects[ object_id ] == 'object' && syncio.objects[ object_id ].users[user.token] === user ) {
            
            var fn = syncio.get( syncio.objects[ object_id ].object, path );
            if ( typeof fn == 'function' ) {

                response.push( request[1] );

                var params = request[3],
                
                promise = { request: request, response: response, user: user };
                promise.resolve = syncio.response.resolve.bind( promise );
                promise.reject = syncio.response.reject.bind( promise );

                params.push( promise );

                return fn.apply( syncio.objects[ object_id ].object, params );

            }
        }

    }

    response.push( syncio.error.REJECT_CALL_NOT_EXISTS );

    user.send( JSON.stringify( response ) );

};




//////////  src/on/close.js


syncio.on.close = function( user_socket ){

    var object_name, object_id, user = this.users[ user_socket[syncio.key_user_token] ];

    this.emit( 'close', user );

    for ( object_name in user.objects ) {

        object_id = user.objects[object_name][syncio.key_object_path][0];

        // Remove object
        if ( syncio.objects[ object_id ].subscribed == 1) // The object only have one user subscribed
            delete syncio.objects[ object_id ];

        // Remove user listener from the object
        else {
            syncio.objects[ object_id ].subscribed--;
            delete syncio.objects[ object_id ].users[ user.token ];
        }

    }

    // Remove user
    delete this.users[ user.token ];

};




//////////  src/on/connect.js


syncio.on.connect = function( user_socket, request ) {

    var response = [request[0] * -1],
        user = new syncio.user( this, user_socket );

    user_socket[ syncio.key_user_token ] = user.token;  
    // Object.defineProperty(user_socket, syncio.key_user_token, {
    //     value: user.token,
    //     enumerable: true,
    //     configurable: true,
    //     writable: false
    // });
   
    // Setup server for new user
    this.users[ user.token ] = user;

    response.push( syncio.protocol.connect, user.token );

    if ( this.key_remote_function !== syncio.key_remote_function )
        response.push( this.key_remote_function );
    

    this.emit( 'connect', user, request, response );

    user.send( JSON.stringify( response ) );

};




//////////  src/on/message.js


syncio.on.message = function( user_socket, message_raw ) {

    var messages, 
        user = (typeof user_socket[syncio.key_user_token] == 'undefined' ) ?
            user_socket
        :
            this.users[ user_socket[syncio.key_user_token] ];

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = this.parse( message_raw ); } 
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


syncio.on.open = function( user_socket ){

    this.emit( 'open', user_socket );

};




//////////  src/on/reject.js


syncio.on.reject = function( user, response ) {

    var request_id = response[0]*-1;
    
    if (this.requests[ request_id ].users === 1 )
        this.requests[ request_id ].promise.reject.call( user, response[1] );
    else
        this.requests[ request_id ].promise.multireject.call( user, response[1] );


};




//////////  src/on/request.js


syncio.on.request = function( user, request ) {

    var response = [ request[0] * -1, request[1] ];

    var promise = { request: request, response: response, user: user };
    promise.resolve = syncio.response.resolve.bind( promise );
    promise.reject = syncio.response.reject.bind( promise );

    var params = [ 'request' ];
    params = params.concat( request[2] );
    params.push(promise);

    this.emit.apply(this, params );

};




//////////  src/user/call.js

// Send a new request
syncio.user.prototype.call = function( path, params ) {

    var data = [ syncio.protocol.call, path, params ],
        request = syncio.request.call( this.syncio, data );

    this.send( this.syncio.stringify( request.data ) );

    return request.promise;
    
};




//////////  src/user/close.js


syncio.user.prototype.close = function() {
    return this.socket.close();
};




//////////  src/user/request.js

// Send a new request
syncio[syncio.side].prototype.request = function() {

    var data = [ syncio.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = syncio.request.call( this.syncio, data );

    this.send( this.syncio.stringify( request.data ) );

    return request.promise;
    
};




//////////  src/user/send.js


syncio.user.prototype.send = function( message ) {
    return this.socket.send( message );
};




//////////  src/user/sync.js


syncio.user.prototype.sync = function( object_name, object, options ) {

    var user = this,
        instance = this.syncio;
        object_name = object_name.trim();

    // If the user already is subscribed to this object
    if ( typeof user.objects[object_name] == 'object' )
        throw new TypeError( syncio.error.SYNC_NO_REPEAT_NAME );

    // Must be an object
    if ( typeof object != 'object' )
        throw new TypeError( syncio.error.SYNC_MUST_BE_OBJECT );


    if (typeof options != 'object')
        options = {};

    if (typeof options.writable != 'boolean')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable != 'boolean')
        options.observable = false; // user/client can edit it from the browser



    // If the object doesn't exist yet
    if ( syncio.typeof( object[syncio.key_object_path] ) != 'array' ) {

        var object_id = syncio.object_inc++,
            path = [object_id];

        syncio.configure.call(
            instance,
            object, 
            path
        );

        syncio.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable}; // users is an objects of the users than are subscribed to this object

    }


    // If the object is already registered
    else {

        // Checking if the object is inside into another object already synced
        if ( object[syncio.key_object_path].length > 1 )
            throw new TypeError( syncio.error.SYNC_NO_INNER );

        // we get the object_id
        var object_id = object[syncio.key_object_path][0];

        // Checking if the object is registered correctly on the same instance of syncio
        if ( typeof syncio.objects[ object_id ] == 'undefined')
            syncio.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable};
        
    }


    syncio.objects[ object_id ].users[ user.token ] = user;
    syncio.objects[ object_id ].subscribed += 1;

    user.objects[object_name] = object;
    user.writables[object_name] = options.writable;


    var request = syncio.request.call( instance, [
        syncio.protocol.sync,
        object_id,
        options.writable*1, // false*1 === 0
        object,
        object_name
    ]);

    user.send( instance.stringify(request.data) );
    return request.promise;

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





//////////  src/util/getsetdelete.js


syncio.get = function ( obj, path, create ) {

    // If path is not an array
    if ( syncio.typeof(path) != 'array')
        throw Error('path parameter must be an array');

    // If path does not have elements we return the object itself
    if (path.length == 0)
        return obj;

    for (var i = 0; i<path.length-1; i++) {

        if ( typeof obj[ path[i] ] == 'object' )
            obj = obj[ path[i] ];

        else if ( create === true )
            obj = obj[ path[i] ] = {};

        else
            return
    }


    if ( create === true && typeof obj[ path[i] ] != 'object' )
        obj[ path[i] ] = {};


    return obj[ path[i] ];

};


syncio.get.set = function ( obj, path, value ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = syncio.get(obj, path, true);

    obj[prop] = value;

    return obj

};


syncio.get.delete = function ( obj, path ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = syncio.get(obj, path);

    ( syncio.typeof(obj) == 'array' && !isNaN(prop) ) ?
        obj.splice(prop, 1)
    :
        delete obj[prop];

    return obj

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

            // // This lines do not allow merge
            // clone = (Array.isArray(val)) ?

            //     (Array.isArray(src)) ? src : []
            // :
            //     (!Array.isArray(src)) ? src : {};

            clone = src;

            first[key] = merge(clone, val);

        }

        return first;
    }

})();




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
//     arrobj: ['a','b','c','d'],
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
//     arrobj: {0:1,1:2},
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

// resu=syncio.merge(obj1, obj2);
// console.log( resu );
// console.log( resu.obj === obj2.obj );
// console.log( resu.fun === obj2.fun );
// console.log( resu.arr === obj2.arr );











// // Based in syncio.path && syncio.get.set
// syncio.merge = (function() {

//     var destiny;

//     function callback(path, value){

//         if ( value && typeof value == 'object' )

//             value = (Array.isArray( value )) ? [] : {};

//         syncio.get.set(destiny, path, value);

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

//             while ( path.length>0 && syncio.get(obj, path) !== this )
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
    var that = this;

    this.state = state;
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
        return that.then(0, onRejected);
    };

    this.resolve = function() {
        if (state != 0) { return that; }
        state = that.state = 1;
        type = that.type = 0;
        schedule.call(that, 0, this, arguments);
    };

    this.reject = function() {
        if (state != 0) { return that; }
        state = that.state = 2;
        type = that.type = 1;
        schedule.call(that, 0, this, arguments);
    };

    this.multiresolve = function() {
        type = that.type = 0;
        schedule.call(that, 0, this, arguments);
    };

    this.multireject = function() {
        type = that.type = 1;
        schedule.call(that, 0, this, arguments);
    };


    var schedule = function(i, scope, params) {
        setTimeout(function(){
            loop.call(that, i, scope, params);
        },0);
    };

    var loop = function( i, scope, params ) {

        var iplus = i+1;

        if ( typeof thens[i] == 'object' && typeof thens[i][this.type] == 'function' ) {

            try {
                params = [thens[i][this.type].apply(
                    ( thens[i][this.type].hasToGoUp ) ? this : scope, // 2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value).
                    params
                )];

                if (this.type && !type)
                    this.type = 0;
            }
            catch (e) {
                this.type = 1;
                params = [e];
            }



            // 2.3.1. If promise and x refer to the same object, reject promise with a TypeError as the reason.
            if (params[0] === this) {
                this.type = 1;
                params[0] = new TypeError("Promise resolved by its own instance");
            }

            // 2.3.2. If x is a promise, adopt its state 
            else if ( params[0] instanceof this.constructor ) {
                var goingup = function(){
                    that.type = this.type;
                    loop.call(that, iplus, scope, arguments);
                };
                goingup.hasToGoUp = true;
                params[0].then(goingup, goingup);
                return;
            }

            /*
            // 2.3.3: Otherwise, if `x` is an object or function
            else if ( params[0] !== null && (typeof params[0] == 'object' || typeof params[0] == 'function') ) {

                try {
                    // 
                    var then = params[0].then;
                    console.log(typeof then)
                } catch (e) {
                    // 2.3.3.2. If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
                    params[0] = e;
                    return this.loop.call(this, iplus, scope, params);
                }

                if ( typeof then == 'function' ) {
                    // 2.3.3.3. If then is a function, call it
                    var called = false;
                    var resolvePromise = function(y) {
                    // console.log(iplus, params)
                        // 2.3.3.3.1. If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                        if (called) { return; }
                        called = true;
                        return loop.call(this, iplus, scope, params);
                    }
                    var rejectPromise = function(r) {
                    // console.log(22222)
                        // 2.3.3.3.2. If/when rejectPromise is called with a reason r, reject promise with r.
                        if (called) { return; }
                        called = true;
                        this.type = 1;
                        return loop.call(this, iplus, scope, params);
                    }

                    try {
                        then.call(params[0], resolvePromise.bind(this), rejectPromise.bind(this));
                    } catch (e) { // 2.3.3.3.4. If calling then throws an exception e,
                        // console.log(333333)
                        // 2.3.3.3.4.1. If resolvePromise or rejectPromise have been called, ignore it.
                        if (called) { return; }
                        // 2.3.3.3.4.2. Otherwise, reject promise with e as the reason.
                        this.type = 1;
                        return loop.call(this, iplus, scope, params);
                    }

                }

            }
            */

        }

        // Next .then()
        if ( iplus < thens.length )
            loop.call(this, iplus, scope, params);

    };


    if ( typeof resolver == 'function' )
        resolver( 
            this.resolve,
            this.reject
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
            if (Array.isArray( value ))
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



