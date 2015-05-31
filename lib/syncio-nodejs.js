



//////////  src/syncio.js

var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
    version: '0.1.0',
    name: 'syncio',
    port: 4444,
    objects: {},
    object_id_key: '$$id',
    user_token_key: '$$token'
};






//////////  src/core/on.js


syncio.on = {

	// server
	open: 'open',
	message: 'message',
	close: 'close',

};




//////////  src/core/protocol.js

// Server
syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.



    // If the response have a 0 as second parameter means the response it's fulfilled
    // [-1234, 0, <params...>]

    // If the response have a second parameter defined as number less than 0 means is an error on any case of 
    // the action's bellow, The number of the error is negative so to get the corret code_error we must make it positive
    // [-1234, -23]   -> -23 * -1 == code_error

    // Also the error response could be custom if is an string
    // [-1234, 'My custom message error']





    // <action>
    connect: 0,         // [ 1234, 0, <user_token>]    ->    If the response of connect (0) have more than 2 parameters means its trying to reconnect/resync
                        // [-1234, 0, <user_token_old>, [[<object_id>,<last_request>], [<object_id>,<last_request>], ...]]

    get: 3,             // [ 1234, 3, <object_id>, ['path','path'], 'param', 'param', ...]
                        // [-1234, 0, <data_returned>]

    set: 4,             // [ 1234, 4, <object_id>, ['path','path'], 'value']    ->   If value is not defined then is a delete
                        // [-1234, 0]

    request: 5,          // [ 1234, 5, <params...>]
                        // [-1234, 0]

};







//////////  src/core/request.js


syncio.request = function () {

    var request = Array.prototype.slice.call(arguments, 0),
    request_id = this.request_id++;
    request.unshift( this.request_id++ );
    this.requests[ request_id ] = {request: request, total: 1};
    return request;

};




//////////  src/core/server.js


syncio.server = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = syncio.SockJS;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: function( user ){

            // Setup new user
            token = (Math.random() * Math.pow(10,17));
            user[syncio.user_token_key] = token; // http://jsperf.com/token-generator
            user[syncio.user_server_key] = $this;

            // Setup server for new user
            $this.users[ token ] = user;
            $this.emit( syncio.on.open, user );

            // Sending token to the user
            user.send( JSON.stringify( syncio.request.call($this, syncio.protocol.connect, token) ) );
            // For broadcast
            // request = syncio.request.call($this, syncio.protocol.connect, token);
            // $this.requests[ request[0] ].total += 1;

        },

        message: function(user, message){

            message_json = undefined;

            if (typeof message == 'string') {
                try { message_json = syncio.parse( message ); } 
                catch(e) {}
            }
            else 
                message_json = message;

            $this.emit( syncio.on.message, user, message_json, message );
        },

        close: function(user){
            $this.emit( syncio.on.close, user );
            delete $this.users[ user[syncio.user_token_key] ];
        }

    },

    message_json, token,

    $this = new EventEmitter;

    $this.request_id = 1;

    $this.requests = {};

    $this.responses = {};

    $this.objects = {};

    $this.users = {};

    $this._object_inc = 0;

    $this.adapter = $this[options.adapter.name_adapter] = options.adapter( options, on );


    return $this;

};





//////////  src/util/assign.js

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
// http://jsperf.com/deepmerge-comparisions/4
if (!Object.assign) {

    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });

}




// // Based on: https://github.com/unclechu/node-deep-extend (Performace: http://jsperf.com/deepmerge-comparisions/3)
// syncio.assign = (function() {

//     return function assign(first, second) {

//         var args = arguments,
//             key, val, src, clone;

//         if (args.length < 2) return first;

//         if (args.length > 2) {
//             // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
//             Array.prototype.splice.call(args, 0, 2, assign(first, second));
//             // Recursion
//             return assign.apply(this, args);
//         }


//         for (key in second) {

//             if (!(key in second)) continue;

//             src = first[key];
//             val = second[key];

//             if (val === first) continue;

//             if (typeof val !== 'object' && !Array.isArray(val)) {
//             //if (!first.hasOwnProperty(key) || (typeof val !== 'object' && !Array.isArray(val))) {
//                 first[key] = val;
//                 continue;
//             }


//             if ( typeof src !== 'object' || src === null ) {
//                 clone = (Array.isArray(val)) ? [] : {};
//                 first[key] = assign(clone, val);
//                 continue;
//             }


//             clone = (Array.isArray(val)) ?

//                 (Array.isArray(src)) ? src : []
//             :
//                 (!Array.isArray(src)) ? src : {};



//             first[key] = assign(clone, val);
//         }

//         return first;
//     }

// })();


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
// r=syncio.merge({},obj2,obj1);
// console.log( r );
// console.log( r.obj === obj2.obj );
// console.log( r.fun === obj2.fun );
// console.log( r.arr === obj2.arr );






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





//////////  src/util/parse.js


syncio.parse = function() {

    return JSON.parse( data, syncio.parse.callback );

};

syncio.parse.type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse
syncio.parse.callback = function (k, v) {
        
    //http://jsperf.com/serializing-date-on-json-parse
    if ( typeof v === 'string' ) {
        var regexp = syncio.protocol.type_date.exec(v);
        if ( regexp )
            return new Date(v);
    }

    return v;

};





//////////  src/util/stringify.js


syncio.stringify = function( data ) {

    return JSON.stringify( data, syncio.stringify.callback );

};

syncio.stringify.type_function = '$f';
syncio.stringify.type_binary = '$b';
syncio.stringify.callback = function (k, v){

    if (typeof v == 'function')
        return syncio.stringify.type_function;
    
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







//////////  src/adapter/websockets.js

// https://github.com/theturtle32/WebSocket-Node




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



