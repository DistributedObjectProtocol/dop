



//////////  src/syncio.js

var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
    version: '0.1.0',
    name: 'syncio',
    port: 4444,
    key_object_id: '$$id',
    key_user_token: '$$token',
};






//////////  src/core/create.js


syncio.create = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = syncio.ws;

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
    
    this.adapter = this[options.adapter.name_adapter] = options.adapter( options, on );

};


syncio.create.prototype = Object.create( EventEmitter.prototype );






//////////  src/core/error.js


syncio.error = {};




//////////  src/core/error_server.js


syncio.error.server = {
    object_not_found: -1
};




//////////  src/core/on.js


syncio.on = {

    // WebSockets / adapters
    open: 'open',
    message: 'message',
    close: 'close',

    // OSP
    connect: 'connect',
    sync: 'sync',

};




//////////  src/core/onclose.js


syncio.onclose = function(user){
    this.emit( syncio.on.close, user );
    delete this.users[ user[syncio.user_token_key] ];
}




//////////  src/core/onmessage.js


syncio.onmessage = function( user, message ) {

    var user = this.users[ user[syncio.key_user_token] ],
        requests = undefined;

    if (typeof message == 'string') {
        try { requests = syncio.parse( message ); } 
        catch(e) {}
    }
    else 
        requests = message;


    this.emit( syncio.on.message, user, requests, message );


    // Managing protocol
    if ( typeof requests == 'object' ) {


        if (typeof requests[0] != 'object')
            requests = [requests];


        // Managing all requests one by one
        for (var i=0, t=requests.length, request, requests_id, action; i<t; i++) {

            request = requests[i];
            request_id = request[0];
            action = request[1];


            // Is a request?
            if (request_id > 0) {

                var response = [request_id * -1];

                // SYNC
                if ( syncio.protocol.sync === action ) {

                    var object_name = request[2];

                    // If Object not found
                    if (typeof this.objects_original[object_name] != 'object')
                        response.push( syncio.error.server.object_not_found );

                    else {

                        response.push( action );

                        var sync_object = function( object ) {

                            // If the object doesn't exist yet
                            if ( typeof object[syncio.key_object_id] == 'undefined' ) {
                                console.log( this );
                                this.objects[ this.object_id ] = {object:object, name:object_name, users:{}}; // users is an objects of the users than are subscribed to this object
                                var object_id = this.object_id++;
                                Object.defineProperty(object, syncio.key_object_id, {value: object_id});
                            }
                            // If the object exists we get the object_id
                            else
                                var object_id = object[syncio.key_object_id];

                            // Set to the user if the object is writable for him or not
                            user.writables[object_name] = this.objects_original[object_name].writable;

                            // Adding the user as subscriber of this object
                            this.objects[ object_id ].users[ user.token ] = 0; 
                            
                            // Forming the response
                            response.push(
                                object_id,
                                user.writables[object_name]*1, // false*1 === 0
                                object
                            );

                            syncio.onmessage.request.call(this, user, request, response);

                        };

                        // Getting the object
                        return ( typeof this.objects_original[object_name].object == 'function' ) ?
                            this.objects_original[object_name].object( user, requests, sync_object.bind(this) )
                        :
                            sync_object.call(this, this.objects_original[object_name].object );

                    }

                }

                

            }

            // Then is a response.
            else {

            }

        }

    }

};


syncio.onmessage.request = function( user, request, response ) {

    // Forming params for the event onsync
    var params = [syncio.on.sync, user, response].concat( request.slice(2) );

    // We emit the event
    this.emit.apply( this, params );

    // Sending the response
    this.response( user, response );

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
    user_socket.send( JSON.stringify( this.request(syncio.protocol.connect, user.token).data ) );
    // For broadcast
    // request = this.request(syncio.protocol.connect, user[syncio.key_user_token]).data );
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
    // [ 1234, 1, <user_token>, <extra_params...>]





                        // Server
    connect: 1,         // [ 1234, 1, <user_token>]    ->    If the response of connect (1) have more than 2 parameters means its trying to reconnect/resync
                        // [-1234, 1, <user_token_old>, [[<object_id>,<last_request>], [<object_id>,<last_request>], ...]]
    

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


    get: 5,             // [ 1234, 5, <object_id>, ['path','path'], 'param', 'param', ...]
                        // [-1234, 5, <data_returned>]


    set: 6,             // [ 1234, 6, <object_id>, ['path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 6, <object_id>, ['path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only for the client
                        // [-1234, 6]



};







//////////  src/core/return.js


syncio.return = function( data ) {
    var _return = arguments.callee.caller.arguments[arguments.callee.caller.arguments.length-1];
    return (typeof _return == 'function') ? _return( data ) : data;
};




//////////  src/core/server.js


syncio.server = function( options ) {

    return new syncio.create( options );

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
    if ( typeof value == 'boolean' ) {
        this.writables[name] = value
    }
    else
        return this.writables[name];
};






//////////  src/create/request.js


syncio.create.prototype.request = function () {

    var data = Array.prototype.slice.call(arguments, 0),
    request_id = this.request_id++;
    data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: data, 
        promise: new syncio.promise()
    };

};




//////////  src/create/response.js

// Where the response of every request is sended
syncio.create.prototype.response = function ( user, response ) {

	user.send( syncio.stringify(response) );

};





//////////  src/create/sync.js


syncio.create.prototype.sync = function( name, options ) {

    if (typeof options != 'object')
        options = {};

    if (options.object == null || (typeof options.object != 'object' && typeof options.object != 'function'))
        options.object = {}; // create a copy/clone for any user that subscribe this object

    if (typeof options.writable == 'undefined')
        options.writable = false; // user can edit it from the browser

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

            if (typeof val !== 'object' && !Array.isArray(val)) {
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
        //     var _this = this;
        // else{
        //     var _this = Object.create(this);
        //     _this._chain = 0;
        // }

        // _this._chain++;
        // return _this;
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
                (function(_this, _i, _promise) {
                    var goingup = function(){
                        _this.type = this.type;
                        loop.call(_this, _i, arguments);
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








//////////  src/util/stringify.js


syncio.stringify = function( data ) {

    return JSON.stringify( data, syncio.stringify_callback );

};

syncio.stringify_type_function = '$f';
syncio.stringify_type_binary = '$b';
syncio.stringify_callback = function (k, v){

    if (typeof v == 'function')
        return syncio.stringify_type_function;
    
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






//////////  src/adapter/http.js





//////////  src/adapter/socketio.js

// http://socket.io/docs/server-api/
syncio.socketio = function ( options, on ) {

    options.adapter = options._adapter; // Need it because socketio accept the option adapter as parameter natively

    var $this = new syncio.socketio.api( options.httpServer, options );

    if (typeof options.httpServer == 'undefined') {

        if (typeof options.port != 'number')
            options.port = syncio.port;

        $this.listen( options.port );

    }

    $this.of( options.namespace ).on('connection', function( user ){

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


    return $this;

};

syncio.socketio.api = require('socket.io');
syncio.socketio.name_adapter = 'socketio';

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








//////////  src/adapter/sockjs.js

// https://github.com/sockjs/sockjs-node
syncio.SockJS = function ( options, on ) {

    if (typeof options.httpServer == 'undefined')
        throw Error('The adapter SockJS needs the parameter httpServer passed in the options');

    options.prefix = options.namespace;

    var $this = syncio.SockJS.api.createServer( options );

    $this.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.send = syncio.SockJS.send;

        on.open( user );

    });

    $this.installHandlers( options.httpServer, options );

    return $this;

};

syncio.SockJS.api = require('sockjs');
syncio.SockJS.name_adapter = 'SockJS';

syncio.SockJS.send = function( data ) {
    this.write( data );
};



/*

Url-Server: /syncio
Url-Client: /syncio

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/







//////////  src/adapter/ws.js

// https://github.com/websockets/ws
syncio.ws = function ( options, on ) {

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var $this = new syncio.ws.api.Server( options );

    $this.on('connection', function( user ){

        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        on.open( user );

    });


    return $this;

};

syncio.ws.api = require('ws');
syncio.ws.name_adapter = 'ws';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



