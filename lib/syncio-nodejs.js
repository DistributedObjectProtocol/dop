



//////////  src/syncio.js

var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
    version: '0.1.0',
    name: 'syncio',
    port: 4444
};






//////////  src/core/app.js


syncio.app = function( app_name, data_app, data_user ) {

    var $this = new EventEmitter;

    $this.id = this._app_inc++;

    $this.name = app_name;

    $this.data_app = data_app;

    $this.data_user = data_user;

    $this.on_request = function( user, message_json ) {

    };

    this.apps[ $this.id ] = $this;

    this.appsid[ app_name ] = $this.id;

    // this.on( syncio.on.message, function( user, message, message_json ) {
    //     console.log( typeof message, typeof message_json, message, message_json );
    // });

    // this.on( syncio.on.close, function( user ) {

    // });

    

    return $this;

};




//////////  src/core/on.js


syncio.on = {

	// server
	open: 'open',
	message: 'message',
	close: 'close',

};




//////////  src/core/protocol.js


syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.
    // All the requests need and response


    // If the response have a 0 as second parameter means the response it's fulfilled
    // [-1234, 0, <params...>]

    // If the response have a second parameter defined as 1 means is an error on any case of the action's bellow
    // [-1234, 1, <code_error>]




    // <action>
    custom: 0,          // [ 1234, 0, <params...>]
                        // [ -1234, 0]

    sync: 1,            // [ 1234, 1, [<app_name>, <app_name>, ...], <password>]
                        // [-1234, 0, [[<app_id>,<app_data>], [<app_id>,<app_data>], ...]

    reconnect: 2,       // [ 1234, 2, [[<app_id>,<last_request_id_server>], [<app_id>,<last_request_id_server>], ...]]
                        // [ -1234, 0]

    set: 3,             // [ 1234, 3, <app_id>, ['path','path'], 'value']
                        // [ -1234, 0]

    get: 4,             // [ 1234, 4, <app_id>, ['path','path'], param, param]
                        // [-1234, 0, <data_returned>]

    delete: 5,          // [ 1234, 5, <app_id>, ['path','path']]
                        // [ -1234, 0]

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

        open: function(user){
            $this.users[ user.id ] = user;
            $this.emit( syncio.on.open, user);
        },

        message: function(user, message){

            message_json = undefined;

            if (typeof message == 'string') {
                try { message_json = JSON.parse( message ); } 
                catch(e) {}
            }
            else 
                message_json = message;

            $this.emit( syncio.on.message, user, message, message_json );
        },

        close: function(user){
            $this.emit( syncio.on.close, user );
            delete $this.users[ user.id ];
        }

    },

    message_json,

    $this = new EventEmitter;

    $this.apps = {};

    $this.appsid = {};

    $this.users = {};

    $this.adapter = $this[options.adapter.name_adapter] = options.adapter( options, on );

    $this._app_inc = 0;

    $this.app = syncio.app.bind( $this );


    // // Broadcast data to all users
    // $this.send = function( data ) {
    //     for (var id in $this.users)
    //         $this.users[id].$send( data );
    // };


    return $this;

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
// r=syncio.merge({},obj2,obj1);
// console.log( r );
// console.log( r.obj === obj2.obj );
// console.log( r.fun === obj2.fun );
// console.log( r.arr === obj2.arr );






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






//////////  src/util/wrap.js


syncio.wrap = {

    type_function: '{f}',
    type_date: /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/, //http://jsperf.com/serializing-date-on-json-parse


    stringify: function (k, v){

        if (typeof v == 'function')
            return syncio.protocol.type_function;
        
        return v;
    },

    parse: function (k, v) {
        
        //http://jsperf.com/serializing-date-on-json-parse
        if ( typeof v === 'string' ) {
            var regexp = syncio.protocol.type_date.exec(v);
            if ( regexp )
                return new Date(v);
        }

        return v;

    }


};




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

    var id = 1;

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var $this = new syncio.ws.api.Server( options );

    $this.on('connection', function( user ){

        user.id = id++;

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



