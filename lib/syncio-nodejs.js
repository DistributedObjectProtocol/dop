



//////////  src/syncio.js

var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
    version: '1.0.0',
    name: 'syncio',
    port: 4444,
    key_user_token: '$$token',
    key_object_path: '$$path',
	remote_function: '$$f',
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

        open: syncio.onopen.bind(this),

        message: syncio.onmessage.bind(this),

        close: syncio.onclose.bind(this)

    };


    this.objects_original = {};

    this.objects = {};
    this.object_id = 1;

    this.users = {};
    this.user_id = 1;

    this.requests = {};
    this.request_id = 1;
    
    this.connector = this[options.connector.name_connector] = options.connector( options, on );

    this.observe = syncio.observe.bind(this);

};


syncio.api.prototype = Object.create( EventEmitter.prototype );






//////////  src/core/configure.js


syncio.configure = function( object, path, observable ) {

    var that = this;

    // Setting the object path/id to the object itself
    Object.defineProperty( object, syncio.key_object_path, {value: path} );

    if ( observable )
        Object.observe( object, this.observe );


    syncio.path( object, function(subpath, value, key, obj ) {

        var newpath = path.concat(subpath);

        if ( value === syncio.remote_function )
            obj[key] = syncio.create_remote_function.call( this, newpath );

        if ( observable && value !== null && typeof value == 'object' ) {

            Object.defineProperty( value, syncio.key_object_path, {value: newpath} );

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
    // return function remote_function() {

    //     return that.call( path, arguments );

    // };
	
	// http://jsperf.com/dynamic-name-of-functions
    return new Function(
        "return function " + syncio.remote_function + "(){  return that.call( path, arguments ); }"
    )();

};




//////////  src/core/error.js


syncio.error = {
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





//////////  src/core/on.js


syncio.on = {

    // WebSockets / connectors
    open: 'open',
    message: 'message',
    close: 'close',

    // OSP
    error: 'error',
    connect: 'connect',
    sync: 'sync',

};




//////////  src/core/onclose.js


syncio.onclose = function( user ){

    user = this.users[ user[syncio.key_user_token] ];

    this.emit( syncio.on.close, user );

    for ( var object_name in user.objects ) {

        // Remove object
        if (
            this.objects_original[object_name].object !== user.objects[object_name] && // Original object is different to the object
            this.objects[ user.objects[object_name][syncio.key_object_path][0] ].subscribed == 1 // The object only have had one subscribed
            // && !syncio.onclose.multipleusers(this.objects[ user.objects[object_name][syncio.key_object_path][0]].users, user.token )
        )
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ];

        // Remove user listener from the object
        else
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ].users[ user.token ];

    }


    delete this.users[ user.token ];

};

// // Return true if the object has more users than the user_token passed
// syncio.onclose.multipleusers = function( users, user_token ) {

//     for (var token in users)

//         if ( user_token != token )

//             return true;

//     return false;

// };




//////////  src/core/onmessage.js


syncio.onmessage = function( user, message_raw ) {

    var user = this.users[ user[syncio.key_user_token] ],
        messages = undefined;

    if (typeof message_raw == 'string') {
        try { messages = syncio.parse( message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( syncio.on.message, user, messages, message_raw );


    // Managing protocol
    if ( typeof messages == 'object' ) {


        if (typeof messages[0] != 'object')
            messages = [messages];


        // Managing all messages one by one
        for (var i=0, t=messages.length, request, messages_id, action; i<t; i++) {

            request = messages[i];
            request_id = request[0];
            action = request[1];

            // If is a number we manage the OSP message
            if ( typeof request_id == 'number' ){

                // REQUEST ===============================================================
                if ( request_id > 0 ) {

                    var response = [request_id * -1];

                    // SYNC
                    if ( syncio.protocol.sync === action ) {

                        var object_name = request[2];

                        // If Object not found
                        if (typeof this.objects_original[object_name] != 'object') {
                            response.push( syncio.error.client.OBJECT_NOT_FOUND );
                            syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
                        }

                        // If the user already is subscribed to this object
                        else if ( typeof user.objects[object_name] == 'object' ) {
                            response.push( syncio.error.client.ALREADY_SYNCED );
                            syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
                        }

                        else {

                            response.push( action );

                            var sync_object = function( object ) {

                                // object must be an array or object
                                if ( object == null || typeof object != 'object' )
                                    throw new TypeError( syncio.error.SYNC_MUST_BE_OBJECT );



                                // If the object exists we get the object_id
                                if ( syncio.typeof( object[syncio.key_object_path] ) == 'array' ) {

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
                                syncio.onmessage.response.call(this, syncio.on.sync, user, request, response );

                            };

                            // Getting the object
                            ( typeof this.objects_original[object_name].object == 'function' ) ?
                                this.objects_original[object_name].object( user, messages, sync_object.bind(this) )
                            :
                                sync_object.call( this, this.objects_original[object_name].object );

                        }

                    }

                }

                // RESPONSE ===============================================================
                else {

                    request_id *= -1;

                    if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                        // Connect
                        if ( syncio.protocol.connect === action )
                            this.emit( syncio.on.connect, user );

                    }

                    // Removing request
                    delete this.requests[request_id];

                }

            }

        }

    }

};


syncio.onmessage.response = function( eventype, user, request, response ) {

    // Forming params for the event onsync
    var emit_params = [eventype, user, request, response];

    // We emit the event
    this.emit.apply( this, emit_params );

    // Sending the response
    user.send( syncio.stringify(response) );

};






//////////  src/core/onopen.js


syncio.onopen = function( user_socket ){

    // Setup new user
    var user = new syncio.user( user_socket, this.user_id++ );
    user_socket[ syncio.key_user_token ] = user.token;

    // Setup server for new user
    this.users[ user.token ] = user;
    this.emit( syncio.on.open, user );

    // Sending token to the user
    user_socket.send( JSON.stringify( this.request_create(syncio.protocol.connect, user.token).data ) );
    // For broadcast
    // request = this.request_create(syncio.protocol.connect, user[syncio.key_user_token]).data );
    // this.requests[ request[0] ].total += 1;

};




//////////  src/core/protocol.js


syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array
    // [[<request_one>, <action>, <params...>], [<request_two>, <action>, <params...>]]

    // If the response have a number greater than -1 as second parameter means the response it's fulfilled
    // [-1234, 2, <params...>]

    // If the response have a second parameter defined as number less than 0 means is an error on any case of 
    // the action's bellow, The number of the error is negative so to get the corret code_error we must make it positive
    // [-1234, -23]   -> -23 * -1 == code_error

    // Also the error response could be custom if is an string
    // [-1234, 'My custom message error']

    // You can always pass more extra parameters on any action
    // [ 1234, 2, <user_token>, <extra_params...>]





                        // Server
    connect: 1,         // [ 1234, 1, <user_token>]
                        // [-1234, 1, <user_token_old>, [[<object_id>,<last_request>], [<object_id>,<last_request>], ...]]   ->   If the user response with a old token means is trying to resync because it lost the connection
    

    request: 2,         // [ 1234, 2, <params...>]
                        // [-1234, 2, <params...>]


    sync: 3,            // Server
                        // [ 1234, 3, <object_id>, <writable 0|1>, <data_object>]
                        // [-1234, 3]
                        // Client
                        // [ 1234, 3, <name>, <params...>]
                        // [-1234, 3, <object_id>, <writable 0|1>, <data_object>]



    unsync: 4,          // [ 1234, 4, <object_id>]
                        // [-1234, 4]


    call: 5,            // [ 1234, 5, <object_id>, ['path','path'], 'param', 'param', ...]
                        // [-1234, 5, [<params_returneds>], 2]


    set: 6,             // [ 1234, 6, <object_id>, ['path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 6, <object_id>, ['path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 6]



};







//////////  src/core/user.js


syncio.user = function( user_socket, user_id ){

    // Setup new user
    this.token = (user_id).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator
             // (this.user_id++).toString(36) + (Math.random() * Math.pow(10,18)).toString(36)  // http://jsperf.com/token-generator-with-id
             //  Number((this.user_id++) + "" + (Math.random() * Math.pow(10,18))).toString(36)

    this.socket = user_socket;
    this.writables = {};
    this.objects = {};

};


syncio.user.prototype.send = function( message ) {
    return this.socket.send( message );
};

syncio.user.prototype.close = function() {
    return this.socket.close();
};

syncio.user.prototype.writable = function( name, value ) {

    if ( typeof value == 'boolean' )
        this.writables[name] = value

    else
        return this.writables[name];

};






//////////  src/api/call.js


syncio.api.prototype.call = function ( path, args ) {

	console.log(this, path, args)

	args = Array.prototype.slice.call( args );
	var promise = new syncio.promise();
	return promise;


};




//////////  src/api/request.js


syncio.api.prototype.request_create = function () {

    var data = Array.prototype.slice.call(arguments, 0),
    request_id = this.request_id++;
    data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: data, 
        promise: new syncio.promise()
    };

};


syncio.api.prototype.request = function () {
    var request = this.request_create.apply(this, arguments);
    return request.promise;
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








//////////  src/util/parse.js


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








//////////  src/util/return.js


syncio.return = function( data ) {

    var args = arguments, _return;

    while ( typeof args.callee.caller == 'function' ) {

        _return = args.callee.caller.arguments[args.callee.caller.arguments.length-1];

        if ( typeof _return == 'function'/* && _return.name == syncio.name_return_function*/ ) {
            _return( data );
            return data;
        }
        else
            args = args.callee.caller.arguments;
    }

    return data;
    
};


/*
function fun( a, b ) {

    return (function() {
        // (function() {
        //     (function() {
        //         (function() {
        //             (function() {
                        return syncio.return( a+b );
        //             })();
        //         })();
        //     })();
        // })();
    })();

}


var f=function syncioreturn( result ){console.log(result);};
console.log( fun(1,2, f) );
*/







//////////  src/util/stringify.js


syncio.stringify = function( data ) {

    return JSON.stringify( data, syncio.stringify_callback );

};

syncio.stringify_callback = function (k, v){

    if ( typeof v == 'function' && v.name !== syncio.remote_function )
        return syncio.remote_function;
    
    return v;
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



