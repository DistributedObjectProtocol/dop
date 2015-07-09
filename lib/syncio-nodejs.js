



//////////  src/syncio.js

var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
    version: '0.1.0',
    name: 'syncio',
    port: 4444,
    objects: {},
    // object_id_key: '$$id'
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


    this.request_id = 1;

    this.requests = {};

    this.object_original = {};

    this.objects = [];

    this.users = {};

    this.adapter = this[options.adapter.name_adapter] = options.adapter( options, on );

};


syncio.create.prototype = Object.create( EventEmitter.prototype );






//////////  src/core/error.js


syncio.error = {};




//////////  src/core/error_server.js


syncio.error.server = {
    notfound: -1
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

    var requests = undefined;

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
        for (var i=0, t=requests.length, requests_id, action, request, params; i<t; i++) {

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
                    if (typeof this.object_original[object_name] != 'object')
                        response.push( syncio.error.server.notfound );

                    else {

                        var object, object_id;

                        response.push( action );

                        if (!this.object_original[object_name].options.unique || this.object_original[object_name].ids.length==0) {
                            object = syncio.merge({}, this.object_original[object_name].object);
                            object_id = this.objects.push( {object:object, users: [user.token]} )-1; // The second parameter is an array of the users than are subscribed to this object
                            this.object_original[object_name].ids.push( object_id );
                        }
                        else {
                            object_id = this.object_original[object_name].ids[0];
                            object = this.objects[object_id].object;
                            this.objects[object_id].users.push( user.token );
                        }
                        response.push(object_id);
                        response.push(object);
                    }

                    params = [user, response].concat( request.slice(2) );
                    params.unshift( syncio.on.sync );
                    
                    this.emit.apply( this, params );

                }

                

            }

            // Then is a response.
            else {

            }

        }

    }


};




//////////  src/core/onopen.js


syncio.onopen = function( user ){

    // Setup new user
    user.token = (Math.random() * Math.pow(10,18)); // http://jsperf.com/token-generator

    // Setup server for new user
    this.users[ user.token ] = user;
    this.emit( syncio.on.open, user );

    // Sending token to the user
    user.send( JSON.stringify( this.request(syncio.protocol.connect, user.token).data ) );
    // For broadcast
    // request = this.request(syncio.protocol.connect, user.token).data );
    // this.requests[ request[0] ].total += 1;

}




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
                        // [ 1234, 3, <object_id>, <data_object>, <writable 0|1>]
                        // [-1234, 3]
                        // Client
                        // [ 1234, 3, <name_or_id>, <params...>]
                        // [-1234, 3, <object_id>, <data_object>, <writable 0|1>]



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




//////////  src/create/request.js


syncio.create.prototype.request = function () {

    var data = Array.prototype.slice.call(arguments, 0),
    request_id = this.request_id++;
    data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: data, 
        promise: syncio.promise()
    };

};




//////////  src/create/sync.js


syncio.create.prototype.sync = function( name, object, options ) {

    if (typeof options != 'object')
        options = {};

    if (typeof options.unique == 'undefined')
        options.unique = false; // create a copy/clone for any user that subscribe this object

    if (typeof options.writable == 'undefined')
        options.writable = false; // user can edit it from the browser

    if (typeof options.observable == 'undefined')
        options.observable = (typeof Object.observe == 'function'); // observe changes with Object.observe


    this.object_original[name] = {object:object, options:options, ids:[]};

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


syncio.promise = function( request ) {

    var
    canceled = false,
    deferred = {},
    promise = new Promise(function(resolve, reject) {
        deferred.resolve = function() {
            if (!canceled)
                return resolve.apply(promise, arguments);
        };
        deferred.reject = function() {
            if (!canceled)
                return reject.apply(promise, arguments);
        };
    });
    promise.deferred = deferred;

    if (typeof request == 'function') {

        var cancel_fun = request.call(promise, deferred.resolve, deferred.reject);

        if (typeof cancel_fun == 'function') {
            promise.cancel = function() {
                canceled = true;
                cancel_fun.apply(promise, arguments);
            };
        }

    }

    return promise;

};







// var mypromise = syncio.promise(function(resolve, reject){

//     var id = setTimeout(function(){
//         resolve(123);
//     },1000);

//     return function cancel(){
//         // clearTimeout(id);
//     };

// });


// mypromise
// .then(function(x){
//     return x+1;
// })
// .then(function(x){
//     return syncio.promise(function(resolve){ 
//         setTimeout(function(){ 
//             resolve(x+1);
//         },2000);
//     });
// })
// .then(function(x){
//     console.log( x );
// })

// // This is how we can cancel the promise before is resolved
// setTimeout(function(){
//     // mypromise.cancel();
// },500);






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



