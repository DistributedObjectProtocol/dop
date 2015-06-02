



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






//////////  src/core/create.js


syncio.create = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = syncio.SockJS;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: syncio.onopen.bind(this),

        message: syncio.onmessage.bind(this),

        close: syncio.onclose.bind(this)

    };


    this.request_id = 1;

    this.requests = {};

    this.objects = {};

    this.users = {};

    this.adapter = this[options.adapter.name_adapter] = options.adapter( options, on );


};


syncio.create.prototype = Object.create( EventEmitter.prototype );






//////////  src/core/on.js


syncio.on = {

	// WebSockets / adapters
	open: 'open',
	message: 'message',
	close: 'close',

	// OSP
	connect: 'connect',

};




//////////  src/core/onclose.js


syncio.onclose = function(user){
    this.emit( syncio.on.close, user );
    delete this.users[ user[syncio.user_token_key] ];
}




//////////  src/core/onmessage.js


syncio.onmessage = function(user, message){

    var message_json = undefined;

    if (typeof message == 'string') {
        try { message_json = syncio.parse( message ); } 
        catch(e) {}
    }
    else 
        message_json = message;

    this.emit( syncio.on.message, user, message_json, message );
    
};




//////////  src/core/onopen.js


syncio.onopen = function( user ){

    // Setup new user
    var token = (Math.random() * Math.pow(10,18));
    user[syncio.user_token_key] = token; // http://jsperf.com/token-generator
    user[syncio.user_server_key] = this;

    // Setup server for new user
    this.users[ token ] = user;
    this.emit( syncio.on.open, user );

    // Sending token to the user
    user.send( JSON.stringify( this.request(syncio.protocol.connect, token) ) );
    // For broadcast
    // request = syncio.request.call(this, syncio.protocol.connect, token);
    // this.requests[ request[0] ].total += 1;

}




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

    request: 1,         // [ 1234, 1, <params...>]
                        // [-1234, 0]

    sync: 2,            // [ 1234, 2, <object_id>, <writable 0 | 1>]
                        // [-1234, 0]

    unsync: 3,          // [ 1234, 3, <object_id>]
                        // [-1234, 0]

    get: 4,             // [ 1234, 4, <object_id>, ['path','path'], 'param', 'param', ...]
                        // [-1234, 0, <data_returned>]

    set: 5,             // [ 1234, 5, <object_id>, ['path','path'], 'value']    ->   If value is not defined then is a delete
                        // [-1234, 0]

};







//////////  src/core/server.js


syncio.server = function( options ) {

    return new syncio.create( options );

};




//////////  src/create/request.js


syncio.create.prototype.request = function () {

    var request = Array.prototype.slice.call(arguments, 0),
    request_id = this.request_id++;
    request.unshift( this.request_id++ );
    this.requests[ request_id ] = {request: request, total: 1};
    return request;

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





//////////  src/util/parse.js


syncio.parse = function( data ) {

    return JSON.parse( data, syncio.parse_callback );

};

syncio.parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse
syncio.parse_callback = function (k, v) {
        
    //http://jsperf.com/serializing-date-on-json-parse
    if ( typeof v === 'string' ) {
        var regexp = syncio.protocol.type_date.exec(v);
        if ( regexp )
            return new Date(v);
    }

    return v;

};




//////////  src/util/promise.js


syncio.promise = function( request ) {

    var deferred = {},
    promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject  = reject;
    });
    promise.deferred = deferred;

    if (typeof request == 'function')
        request.call(promise, deferred.resolve, deferred.reject);

    return promise;

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



