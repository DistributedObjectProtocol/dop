



//////////  src/syncio.js

var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
    version: '0.1.0',
    name: 'syncio',
    port: 4444
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




    // If the response have a 0 as second parameter means the response it's fulfilled
    // [-1234, 0, <params...>]

    // If the response have a second parameter defined as 1 means is an error on any case of the action's bellow
    // [-1234, 1, <code_error>]




    // <action>
    custom: 0,          // [ 1234, 0, <params...>]
                        // [ -1234, 0]

    sync: 1,            // [ 1234, 1, [<scope_name>, <scope_name>, ...], <password>]
                        // [-1234, 0, [[<scope_id>,<scope_data>], [<scope_id>,<scope_data>], ...]

    reconnect: 2,       // [ 1234, 2, [[<scope_id>,<last_request_id_server>], [<scope_id>,<last_request_id_server>], ...]]
                        // [ -1234, 0]

    set: 3,             // [ 1234, 3, <scope_id>, ['path','path'], 'value']
                        // [ -1234, 0]

    get: 4,             // [ 1234, 4, <scope_id>, ['path','path'], param, param]
                        // [-1234, 0, <data_returned>]

    delete: 5,          // [ 1234, 5, <scope_id>, ['path','path']]
                        // [ -1234, 0]

};









//////////  src/core/server.js


syncio.server = function( adapter, options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.url != 'string')
        options.url = '/' + syncio.name;

    var $this = new EventEmitter,

    on = {

        open: function(user){ 
            $this.emit( syncio.on.open, user);
        },

        message: function(user, message){ 
            $this.emit( syncio.on.message, user, message );
        },

        close: function(user){ 
            $this.emit( syncio.on.close, user );
        }

    };

    $this.adapter = adapter( options, on );

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


var socketio = require('socket.io');

syncio.socketio = function ( options, on ) {

    var $this = new socketio( options.http_server );


    if (typeof options.http_server == 'undefined') {

        if (typeof options.port != 'number')
            options.port = syncio.port;

        $this.listen( options.port );

    }


    $this.on('connection', function( user ){

        on.open( user );

        user.on('event', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

    });


    return $this;

};


/*

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

Url-Server: http://localhost:9999/syncio
Url-Client: http://localhost:9999/syncio

*/








//////////  src/adapter/sockjs.js


var sockjs = require('sockjs');

syncio.SockJS = function ( options, on ) {

    if (typeof options.http_server == 'undefined')
        throw Error('The adapter SockJS needs the parameter http_server passed in the options');

    options.prefix = options.url;

    var $this = sockjs.createServer( options );

    $this.on('connection', function(user) {

        on.open( user );

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

    });

    $this.installHandlers( options.http_server, options );

    return $this;

};



/*

Url-Server: /syncio
Url-Client: /syncio

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/







//////////  src/adapter/ws.js


var ws = require('ws');

syncio.ws = function ( options, on ) {


    if (typeof options.http_server != 'undefined')
        options.server = options.http_server;

    else if (typeof options.port != 'number')
        options.port = syncio.port;


    var $this = new ws.Server( options );

    $this.on('connection', function( user ){

        on.open( user );

        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });


    });


    return $this;

};


/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



