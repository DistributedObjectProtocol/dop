



//////////  server/src/synko.js


module.exports = synko = {
    version: '0.7.1',
    name: 'synko',
    side: 'user',
    port: 4444,

    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$SYNKO_REMOTE_FUNCTION',

    util: {},
    on: {},
    _on: {},

    objects: {},
    user_inc: 0,
    object_inc: 0
};






//////////  server/src/core/api.js


synko.api = function( options ) {

    this.options = (synko.util.typeof(options) == 'object') ? options : {};
    this.options.stringify_params = {};

    if (typeof this.options.connector != 'function')
        this.options.connector = synko.ws;

    if (typeof this.options.namespace != 'string')
        this.options.namespace = '/' + synko.name;

    // Adding connector name to the end of the prefix/namespace
    this.options.namespace += this.options.connector.name_connector;


    if (typeof this.options.stringify_function != 'string')
        this.options.stringify_function = synko.stringify_function;
    else
        this.options.stringify_params[synko.stringify_function] = this.options.stringify_function;

    if (typeof this.options.stringify_undefined != 'string')
        this.options.stringify_undefined = synko.stringify_undefined;
    else
        this.options.stringify_params[synko.stringify_undefined] = this.options.stringify_undefined;

    if (typeof this.options.stringify_regexp != 'string')
        this.options.stringify_regexp = synko.stringify_regexp;
    else
        this.options.stringify_params[synko.stringify_regexp] = this.options.stringify_regexp;




    var on = {

        open: synko.on.open.bind( this ),

        message: synko.on.message.bind( this ),

        close: synko.on.close.bind( this )

    };


    this.objects = {};
    this.object_id = 0;

    this.users = {};
    this.user_inc = 0;

    this.requests = {};
    this.requests_inc = 1;
    
    this.connector = this[this.options.connector.name_connector] = this.options.connector( this.options, on );

    this.observe = synko.observe.bind(this);

};


synko.api.prototype = Object.create( require('events').EventEmitter.prototype );






//////////  server/src/core/configure.js

// Configure a new object with the remote callbacks ~PATH and observe if is observable
synko.configure = function( object, path, isobservable ) {

    var that = this;

    Object.defineProperty( object, synko.key_object_path, {value: path} );

    // if ( isobservable )
        // Object.observe( object, this.observe );

    synko.util.path( object, function(subpath, value, key, obj ) {

        var newpath = path.concat(subpath);

        if ( value === that.options.stringify_function )
            obj[key] = synko.remoteFunction.call( that, newpath );

        if ( value !== null && typeof value == 'object' && typeof value[synko.key_object_path] == 'undefined' ) {
        
            Object.defineProperty( value, synko.key_object_path, {value: newpath} );
            
            // if ( isobservable )
                // Object.observe( value, that.observe );

        }

    });

};




/*

synko.api.prototype.observe = function(changes) {

    for (var i=0; i<changes.length; i++) {
        
        var path = changes[i].object._path.slice(0);
        path.push( changes[i].name )

        if (
            (changes[i].type == 'update' || changes[i].type == 'add') &&
            changes[i].object[changes[i].name] !== null &&
            typeof changes[i].object[changes[i].name] == 'object'
        ) {
            synko.observe(changes[i].object[changes[i].name], tcallback_observer, path );
        }

        console.log( changes[i].type, path, changes[i].oldValue );
        console.log()

    }

};




// setTimeout(function(){

MYSERVE = new synko.instance();
MYOBJECT = {
    foo: 0,
    bar: 1,
    obj: {
        paco: 2,
        pil: 3,
        arr: [1,2,3,4]
    }
};

synko.observe(MYOBJECT, MYSERVE.observe.bind(MYSERVE), [12345] );

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




//////////  server/src/core/create.js


synko.create = function( options ) {

    return new synko.api( options );

};




//////////  server/src/core/error.js


synko.error = {

    // REQUEST_UNIQUE: 'The id of the request should be unique (incrementing numericaly) for every request',

    SYNC_MUST_BE_OBJECT: 'The property "object" of the method sync() only accept Objects',
    SYNC_NO_REPEAT_NAME: 'You can not sync different objects with the same name',
    SYNC_NO_INNER: 'Syncio can not sync objects that are inside into another objects already synced',

    REJECT_CALL_NOT_EXISTS: 'You are trying to call a function does not exists',
    REJECT_SET_NOT_EXISTS: 'You are trying to set a property does not exists',
    REJECT_SET_NOT_WRITABLE: 'This object is not writable'

};




//////////  server/src/core/observe.js


synko.observe = function(changes) {

    for (var i=0; i<changes.length; i++) {
        
        var path = changes[i].object[synko.key_object_path].slice(0);
        
        path.push( changes[i].name );

        if (
            (changes[i].type == 'update' || changes[i].type == 'add') &&
            changes[i].object[changes[i].name] !== null &&
            typeof changes[i].object[changes[i].name] == 'object'
        ) {
            synko.configure.call(this, changes[i].object[changes[i].name], path, true );
        }

        // console.log( changes[i].type, path, changes[i].oldValue );
        // console.log()

    }

};





//////////  server/src/core/osp.js


synko.osp = function( user, messages ) {


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
            if (request_id > 0 && typeof synko.on[synko.protocol_keys[action]] == 'function' )
                synko.on[synko.protocol_keys[action]].call( this, user, request );


            // RESPONSE ===============================================================
            else {

                request_id *= -1;

                if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                    action = this.requests[ request_id ].data[1];

                    if ( request[1] === 0 )
                        synko._on[synko.protocol_keys[action]].call( this, user, request );

                    else
                        synko.on.reject.call( this, user, request );

                    // Removing request
                    if ( --this.requests[request_id].users === 0 )
                        delete this.requests[request_id];

                }

            }

        }

    }

};




//////////  server/src/core/parse.js


synko.parse = function parse(data) {

    var that = this;

    return JSON.parse(data, function(k, v) {

        if ( typeof v == 'string' ) {

            if ( v == that.options.stringify_undefined )
                return undefined;

            else if ( parse.parse_type_date.exec(v) )
                return new Date(v);

            else if ( v.substr(0, that.options.stringify_regexp.length) == that.options.stringify_regexp ) {
                var split = /\/(.+)\/([gimuy]{0,5})/.exec(v.substr(that.options.stringify_regexp.length)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
                return new RegExp(split[1], split[2]);
            }

        }

        return v;

    });

};
synko.parse.parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse




//////////  server/src/core/protocol.js


synko.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array
    // [[<request_one>, <action>, <params...>], [<request_two>, <action>, <params...>]]

    // If the response has a 0 as second parameter, means the response it's fulfilled. Any other value is an error
    // [-1234, 0, <params...>]

    // Also the error response could be custom an string
    // [-1234, 'My custom message error']

    // Sending the same request without parameters means a cancel/abort of the request
    // [1234]



    fulfilled: 0,


                        // Client
    connect: 0,         // [ 1234, 0]
                        // [-1234, 0, <user_token>, {'~F':'$custom_F','~U':'$custom_U','~R':'$custom_R'}]


    request: 1,         // [ 1234, 1, [<params...>]]
                        // [-1234, 0, [<params...>]]


    sync: 2,            // Server
                        // [ 1234, 2, <object_id>, <writable 0|1>, <data_object>, <name>]
                        // [-1234, 0, <data_object_merged>]


    unsync: 3,          // [ 1234, 3, <object_id>]
                        // [-1234, 0]


    call: 4,            // [ 1234, 4, [<object_id>, 'path','path'], [<params...>]]
                        // [-1234, 0, [<params...>]]


    set: 5,             // [ 1234, 5, [<object_id>, 'path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 5, [<object_id>, 'path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]


};


synko.protocol_keys = {};
for (var key in synko.protocol)
    synko.protocol_keys[ synko.protocol[key] ] = key;







//////////  server/src/core/reject.js


synko.reject = function() {

    return synko.response( 'reject', arguments );

};




//////////  server/src/core/remoteFunction.js

// Create a remote function
synko.remoteFunction = function ( path ) {

    var that = this;
    return function $SYNKO_REMOTE_FUNCTION() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new Function(
    //     "return function " + synko.name_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};




//////////  server/src/core/request.js

// Create a new request
synko.request = function ( request_data ) {

    var request_id = this.requests_inc++;
    request_data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: request_data, 
        promise: new synko.util.promise(),
        users: 1
    };

};




//////////  server/src/core/resolve.js


synko.resolve = function() {

    return synko.response( 'resolve', arguments );

};




//////////  server/src/core/response.js


synko.response = function( action, params ) {

    var promise;

    return synko.util.arguments( params, function( args ) {

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

synko.response.resolve = function() {

    this.response.push( Array.prototype.slice.call( arguments, 0 ) );

    this.user.send( synko.stringify.call(this.user, this.response ) );

};

synko.response.reject = function( error ) {

    this.response[1] = error;

    this.user.send( synko.stringify.call(this.user, this.response ) );

};









// function fun( a, b ) {

//     return (function() {
//         return (function() {
//              return synko.resolve( a*b );
//         })();
//     })();

// }


// var o={
//     reject: function(){},
//     response: {},
//     resolve: function synko_resolve( result ){
//         console.log('resolved1', result);
//     }
// };
// var o2={
//     reject: function(){},
//     response: {},
//     resolve: function synko_resolve( result ){
//         console.log('resolved2', result);
//     }
// };

// console.log(2, fun(5,5, o) );
// console.log(3, fun(5,5, o) );






//////////  server/src/core/stringify.js


synko.stringify = function(data) {

    var that = this, tof;

    return JSON.stringify(data, function(k, v) {

        tof = typeof v;

        if (tof == 'undefined')
            return that.options.stringify_undefined;

        else if (tof == 'function' && v.name !== synko.name_remote_function)
            return that.options.stringify_function;

        else if (tof == 'object' && v instanceof RegExp)
            return that.options.stringify_regexp + v.toString();

        return v;

    });

};


// types = [
//     123,
//     false,
//     'my string',
//     'string to be deleted',
//     undefined, 
//     null, 
//     function caca() {}, 
//     /^A\wB$/g, 
//     new RegExp("AB", "gi"),
//     new Date(),
//     {a: 12},
//     Symbol("caca"), 
// ];
// delete types[3];

// instance = {stringify_function:'~F', stringify_undefined:'~U', stringify_regexp:'~R'}
// stringify=synko.stringify.bind(instance);
// to = stringify(types);
// parse=synko.parse.bind(instance);
// from = parse(to);


// console.log(types);
// console.log(to);
// console.log(from);










//////////  server/src/core/user.js


synko.user = function( synko, user_socket ){

    this.synko = synko;
    this.socket = user_socket;
    this.writables = {};
    this.objects = {};
    this.token = ( synko.user_inc++ ).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator
             // (this.user_inc++).toString(36) + (Math.random() * Math.pow(10,18)).toString(36)  // http://jsperf.com/token-generator-with-id
             //  Number((this.user_inc++) + "" + (Math.random() * Math.pow(10,18))).toString(36)

};




//////////  server/src/api/call.js

// Send a new request
synko.api.prototype.call = function( path, params ) {

    var token, 
        users_n = 0, 
        users = synko.objects[path[0]].users,
        data = [ synko.protocol.call, path, params ],
        request = synko.request.call( this, data ),
        data_string = synko.stringify.call(this, request.data );

    for (token in users) {
        users_n += 1;
        users[token].send( data_string );
    }

    request.users = users_n;

    return request.promise;
    
};




//////////  server/src/api/remoteFunction.js

// Useful to create remote functions before the sync, when the object synced is not writable: myobject = {remotefun: myserver.remoteFunction()};
synko.api.prototype.remoteFunction = function() {
    return this.options.stringify_function;
};




//////////  server/src/on/_call.js


synko._on.call = function( user, response ) {

    var request_id = response[0]*-1;
    
    this.requests[ request_id ].promise.resolve.apply( user, response[2] );

    if ( this.requests[ request_id ].users === 1 && typeof this.requests[ request_id ].promise.onCompleted == 'function' )
        this.requests[ request_id ].promise.onCompleted();

};




//////////  server/src/on/_request.js


synko._on.request = function( user, response ) {

    this.requests[ response[0]*-1 ].promise.resolve.apply( this, response[2] );

};




//////////  server/src/on/_sync.js


synko._on.sync = function( user, response ) {

    var request_id = response[0]*-1,
        object_id = this.requests[ request_id ].data[2],
        object_name = this.requests[ request_id ].data[5],
        object_remote = response[2],
        object = synko.objects[ object_id] .object;



    // If the object is writable and the response has an object to merge
    if ( user.writables[object_id] && typeof object_remote == 'object' ) {

        synko.util.merge( object_remote, object );

        synko.util.merge( object, object_remote );

        synko.configure.call(this, object, object[synko.key_object_path] );

    }

    this.requests[ request_id ].promise.resolve( object, object_id );

};




//////////  server/src/on/call.js


synko.on.call = function( user, request ) {
    
    var response = [ request[0] * -1 ];

    if (synko.util.typeof( request[2] ) == 'array' ) {
        
        var path = request[2],
            object_id = path.shift();
    
        if ( typeof synko.objects[ object_id ] == 'object' && synko.objects[ object_id ].users[user.token] === user ) {
            
            var fn = synko.util.get( synko.objects[ object_id ].object, path );
            if ( typeof fn == 'function' ) {

                response.push( synko.protocol.fulfilled );

                var params = request[3],
                    promise = { request: request, response: response, user: user };

                promise.resolve = synko.response.resolve.bind( promise );
                promise.reject = synko.response.reject.bind( promise );

                params.push( promise );

                return fn.apply( synko.objects[ object_id ].object, params );

            }
        }

    }

    response.push( synko.error.REJECT_CALL_NOT_EXISTS );

    user.send( JSON.stringify( response ) );

};




//////////  server/src/on/close.js


synko.on.close = function( user_socket ){

    var user = this.users[ user_socket[synko.key_user_token] ]

    if ( typeof user_socket[synko.key_user_token] == 'string' ) {

        var object_name, object_id;

        for ( object_name in user.objects ) {

            object_id = user.objects[object_name][synko.key_object_path][0];

            // Remove object
            if ( synko.objects[ object_id ].subscribed == 1) // The object only have one user subscribed
                delete synko.objects[ object_id ];

            // Remove user listener from the object
            else {
                synko.objects[ object_id ].subscribed--;
                delete synko.objects[ object_id ].users[ user.token ];
            }

        }

        this.emit( 'disconnect', user );

        // Remove user
        delete this.users[ user.token ];

    }

    this.emit( 'close', user_socket );

};




//////////  server/src/on/connect.js


synko.on.connect = function( user_socket, request ) {

    var response = [request[0] * -1],
        user = new synko.user( this, user_socket );

    user_socket[ synko.key_user_token ] = user.token;  
    // Object.defineProperty(user_socket, synko.key_user_token, {
    //     value: user.token,
    //     enumerable: true,
    //     configurable: true,
    //     writable: false
    // });
   
    // Setup server for new user
    this.users[ user.token ] = user;

    response.push( synko.protocol.fulfilled, user.token );

    if ( typeof this.options.stringify_params[synko.stringify_function] == 'string' || 
         typeof this.options.stringify_params[synko.stringify_undefined] == 'string' || 
         typeof this.options.stringify_params[synko.stringify_regexp] == 'string'  )
        response.push( this.options.stringify_params );
    
    this.emit( 'connect', user, request, response );

    user.send( JSON.stringify( response ) );

};




//////////  server/src/on/message.js


synko.on.message = function( user_socket, message_raw ) {

    var messages, 
        user = (typeof user_socket[synko.key_user_token] == 'undefined' ) ?
            user_socket
        :
            this.users[ user_socket[synko.key_user_token] ];

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = synko.parse.call(this, message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', user, messages, message_raw );


    // Managing OSP protocol
    if ( synko.util.typeof( messages ) == 'array' )
        synko.osp.call( this, user, messages );

};




//////////  server/src/on/open.js


synko.on.open = function( user_socket ){

    this.emit( 'open', user_socket );

};




//////////  server/src/on/reject.js


synko.on.reject = function( user, response ) {

    var request_id = response[0]*-1;
    
    if (this.requests[ request_id ].users === 1 )
        this.requests[ request_id ].promise.reject.call( user, response[1] );
    else
        this.requests[ request_id ].promise.multireject.call( user, response[1] );


};




//////////  server/src/on/request.js


synko.on.request = function( user, request ) {

    var response = [ request[0] * -1, synko.protocol.fulfilled ];

    var promise = { request: request, response: response, user: user };
    promise.resolve = synko.response.resolve.bind( promise );
    promise.reject = synko.response.reject.bind( promise );

    var params = [ 'request' ];
    params = params.concat( request[2] );
    params.push(promise);

    this.emit.apply(this, params );

};




//////////  server/src/on/set.js


synko.on.set = function( user, request ) {
    
    var response = [ request[0] * -1 ],
        object_id = request[2][0],
        obj = synko.objects[object_id].object;

    // If the object is writable by the user
    if ( user.writables[object_id] ) {

        var exists = true,
            oldValueRemote = request[3],
            oldValue = synko.util.get(obj, request[2].slice(1), function() { 
                exists = false;
                return false; 
            });


        // console.log('exists:', exists, request, oldValue)

        // If the path exists
        if ( exists ) {
            
            var change = false;
            var newValue = request[4];
            var tof = synko.util.typeof( oldValue );

console.log(tof, oldValue, oldValueRemote, newValue)
            if ( tof == 'object' || tof == 'array' ) { 
                console.log('object o array', 'YEAH')
            }
            else if ( tof == 'regexp' && oldValue.toString() == oldValueRemote.toString() ) {
                console.log('regexp', 'YEAH')
                change = true;
            }
            else if ( tof == 'date' && oldValue.getTime() == oldValueRemote.getTime() ) {
                console.log('date', 'YEAH')
                change = true;
            }
            else if ( tof == 'symbol' ) {
                console.log('symbols', 'cant be synced')
            }

            // console.log(tof, oldValue, newValue);

        }
        else
            response.push( synko.error.REJECT_SET_NOT_EXISTS );
    
    }
    else
        response.push( synko.error.REJECT_SET_NOT_WRITABLE );


    user.send( JSON.stringify( response ) );

};




//////////  server/src/user/call.js

// Send a new request
synko.user.prototype.call = function( path, params ) {

    var data = [ synko.protocol.call, path, params ],
        request = synko.request.call( this.synko, data );

    this.send( synko.stringify.call(this, request.data ) );

    return request.promise;
    
};




//////////  server/src/user/close.js


synko.user.prototype.close = function() {
    return this.socket.close();
};




//////////  server/src/user/request.js

// Send a new request
synko[synko.side].prototype.request = function() {

    var data = [ synko.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = synko.request.call( this.synko, data );

    this.send( synko.stringify.call(this, request.data ) );

    return request.promise;
    
};




//////////  server/src/user/send.js


synko.user.prototype.send = function( message ) {
    return this.socket.send( message );
};




//////////  server/src/user/sync.js


synko.user.prototype.sync = function( object_name, object, options ) {

    var user = this,
        instance = this.synko;
        object_name = object_name.trim(),
        object_id;

    // If the user already is subscribed to this object
    if ( typeof user.objects[object_name] == 'object' )
        throw new TypeError( synko.error.SYNC_NO_REPEAT_NAME );

    // Must be an object
    if ( typeof object != 'object' )
        throw new TypeError( synko.error.SYNC_MUST_BE_OBJECT );


    if (typeof options != 'object')
        options = {};

    if (typeof options.writable != 'boolean')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable != 'boolean')
        options.observable = false; // user/client can edit it from the browser



    // If the object doesn't exist yet
    if ( synko.util.typeof( object[synko.key_object_path] ) != 'array' ) {

        object_id = synko.object_inc++;

        synko.configure.call(
            instance,
            object, 
            [object_id]
        );

        synko.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable}; // users is an objects of the users than are subscribed to this object

    }


    // If the object is already registered
    else {

        // Checking if the object is inside into another object already synced
        if ( object[synko.key_object_path].length > 1 )
            throw new TypeError( synko.error.SYNC_NO_INNER );

        // we get the object_id
        var object_id = object[synko.key_object_path][0];

        // Checking if the object is registered correctly on the same instance of synko
        if ( typeof synko.objects[ object_id ] == 'undefined')
            synko.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable};
        
    }


    synko.objects[ object_id ].users[ user.token ] = user;
    synko.objects[ object_id ].subscribed += 1;

    user.objects[object_name] = object;
    user.writables[object_id] = options.writable;


    var request = synko.request.call( instance, [
        synko.protocol.sync,
        object_id,
        options.writable*1, // false*1 === 0
        object,
        object_name
    ]);

    user.send( synko.stringify.call(instance, request.data) );
    return request.promise;

};




//////////  server/src/util/arguments.js

// This method find arguments from inside to outside, and if the callback return true will stop
synko.util.arguments = function( args, callback ) {

    var finder = args;

    while ( typeof finder.callee.caller == 'function' ) {

        if ( callback( finder.callee.caller.arguments ) )
            return args[0];

        else
            finder = finder.callee.caller.arguments;

    }

    return args[0];
    
};





//////////  server/src/util/get.js


synko.util.get = function ( obj, path, callback_create ) {

    for (var i=0, l=path.length, tof; i<l; i++) {

        tof = synko.util.typeof( obj[ path[i] ] );

        if ( i+1<l && obj[ path[i] ] !== null && (tof == 'object' || tof == 'array') )
            obj = obj[ path[i] ];

        else if ( obj.hasOwnProperty(path[i]) )
            return obj[ path[i] ];

        else if ( callback_create && callback_create(obj, path[i], i) )
            obj[ path[i] ] = {};

        else
            return undefined;

    }

    return obj[ path[i] ];

};


/*

synko.util.get.set = function ( obj, path, value, callback_create ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = synko.util.get(obj, path, callback_create);

    obj[prop] = value;

    return obj

};


synko.util.get.delete = function ( obj, path, callback_create ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = synko.util.get(obj, path);

    ( synko.util.typeof(obj) == 'array' && !isNaN(prop) ) ?
        obj.splice(prop, 1)
    :
        delete obj[prop];

    return obj

};


var obj1 = {
    a: 11,
    b: 12,
    array: [1,2,3,{abc:123}],
    d: {
        d1: 13,
        n: null, 
        d2: {
            d21: 123,
            u: undefined,
            d22: {
                d221: 12,
                d223: { 
                  hola: 'hola',
                  static: 'static'
                }
            }
        }
    },
    arrobj: ['a','b','c','d'],
    f: 5,
    g: 123
};

exists = true;
resu = synko.util.get(obj1, ['d', 'd2', 'd1','a'], function(obj, property, i){ 
    exists = false;
    // console.log(obj.hasOwnProperty(property), i); 
    return !obj.hasOwnProperty(property);  // If the path does not exists and we return true, the path will be create to set the property
    return false;
});

console.log('RESU:',exists,resu,obj1)

*/







//////////  server/src/util/merge.js

// Based on: https://github.com/unclechu/node-deep-extend (Performace: http://jsperf.com/deepmerge-comparisions/3)
synko.util.merge = (function() {

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

            if ( val === null || (typeof val != 'object' && !Array.isArray(val)) || val instanceof Date || val instanceof RegExp ) {
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
// var data = {
//     types: [
//         123,
//         true,
//         'my string',
//         'string to be deleted',
//         undefined, 
//         null,
//         function caca() {}, 
//         /^A\wB$/g, 
//         new RegExp("AB", "gi"),
//         new Date(),
//         {a: 12},
//         Symbol("caca"), 
//     ]
// };
// delete data.types[3];
// console.log(synko.util.merge({},data));

// resu=synko.util.merge(obj1, obj2, );
// console.log( resu );
// console.log( resu.obj === obj2.obj );
// console.log( resu.fun === obj2.fun );
// console.log( resu.arr === obj2.arr );











// // Based in synko.util.path && synko.util.get.set
// synko.util.merge = (function() {

//     var destiny;

//     function callback(path, value){

//         if ( value && typeof value == 'object' )

//             value = (Array.isArray( value )) ? [] : {};

//         synko.util.get.set(destiny, path, value);

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

//         synko.util.path(second, callback);

//         return first;

//     };

// })();







//////////  server/src/util/path.js

// http://jsperf.com/stringify-path-vs-custom-path/2 - http://jsperf.com/stringify-path-vs-custom-path/3
synko.util.path = function (obj, callback) {

    synko.util.path.recursive.call({circular:[]}, obj, callback, []);

};
synko.util.path.recursive = function (obj, callback, path ) {

    for (var key in obj) {

        //if ( obj.hasOwnProperty(key) ) {
        
            path.push( key );

            if ( this.stop == false )
                return;

            this.stop = callback(path, obj[key], key, obj);

            // Avoiding circular loops
            if ( obj[key] && typeof obj[key] == "object" && obj[key] !== obj && this.circular.indexOf(obj[key])==-1 ) {

                this.circular.push(obj[key]);

                synko.util.path.recursive.call(this, obj[key], callback, path );

            }

            path.pop();

        //}

    }

};



// // http://jsperf.com/stringify-clousured-or-not - 
// synko.stringify_path = function(obj, callback) {

//     var path = [];

//     return JSON.stringify(obj, function(k,v){

//         if (v !== obj) {

//             while ( path.length>0 && synko.util.get(obj, path) !== this )
//                 path.pop();

//             path.push(k);

//         }

//         return (typeof callback == 'function') ? callback.call(this, k, v, path) : v;

//     });

// };




//////////  server/src/util/promise.js


synko.util.promise = function( resolver ) {

    var thens = [],
        state = 0, /* 0 = pending, 1 = fulfilled, 2 = rejected, 3 = completed/canceled */
        type,
        onCompleted,
        that = this;

    this.state = state;


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


    this.completed = function( completedCallback ) {
        onCompleted = completedCallback;
        return that;
    };


    this.resolve = function() {
        // if (state != 0) return that; // https://promisesaplus.com/#point-14
        if (state === 3) return that;
        state = that.state = 1;
        type = that.type = 0;
        run(this, arguments);
    };

    this.reject = function() {
        // if (state != 0) return that; // https://promisesaplus.com/#point-17
        if (state === 3) return that;
        state = that.state = 2;
        type = that.type = 1;
        run(this, arguments);
    };

    that.onCompleted = function() {
        state = that.state = 3;
        if ( typeof onCompleted == 'function' )
            onCompleted.apply(this, arguments);
    };


    function run( scope, params ) {
        
        if ( thens.length > 0 )
            loop.call(that, 0, scope, params);

        // If there is no thens added yet, we have to resolve/reject asynchronously
        else
            setTimeout(function() {
                loop.call(that, 0, scope, params);
            }, 0);
    }


    function loop( i, scope, params ) {

        var iplus = i+1;

        if ( typeof thens[i] == 'object' && typeof thens[i][that.type] == 'function' ) {

            try {

                params = [thens[i][that.type].apply(
                    ( thens[i][that.type].hasToGoUp ) ? that : scope, // 2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `that` value).
                    params
                )];

                if (that.type && !type)
                    that.type = 0;

            }
            catch (e) {
                that.type = 1;
                params = [e];
            }



            // 2.3.1. If promise and x refer to the same object, reject promise with a TypeError as the reason.
            if (params[0] === that) {
                that.type = 1;
                params[0] = new TypeError("Promise resolved by its own instance");
            }


            // 2.3.2. If x is a promise, adopt its state 
            else if ( params[0] instanceof that.constructor ) {
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
                    return that.loop.call(that, iplus, scope, params);
                }

                if ( typeof then == 'function' ) {
                    // 2.3.3.3. If then is a function, call it
                    var called = false;
                    var resolvePromise = function(y) {
                    // console.log(iplus, params)
                        // 2.3.3.3.1. If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                        if (called) { return; }
                        called = true;
                        return loop.call(that, iplus, scope, params);
                    }
                    var rejectPromise = function(r) {
                    // console.log(22222)
                        // 2.3.3.3.2. If/when rejectPromise is called with a reason r, reject promise with r.
                        if (called) { return; }
                        called = true;
                        that.type = 1;
                        return loop.call(that, iplus, scope, params);
                    }

                    try {
                        then.call(params[0], resolvePromise.bind(that), rejectPromise.bind(that));
                    } catch (e) { // 2.3.3.3.4. If calling then throws an exception e,
                        // console.log(333333)
                        // 2.3.3.3.4.1. If resolvePromise or rejectPromise have been called, ignore it.
                        if (called) { return; }
                        // 2.3.3.3.4.2. Otherwise, reject promise with e as the reason.
                        that.type = 1;
                        return loop.call(that, iplus, scope, params);
                    }

                }

            }
            */

        }

        // Next .then()
        if ( iplus < thens.length )
            loop(iplus, scope, params);

    }


    if ( typeof resolver == 'function' )
        resolver(
            // that.resolve.bind(null) # 3.2 That is, in strict mode that will be undefined inside of them; in sloppy mode, it will be the global object.
            that.resolve, 
            that.reject
        );

};

// synko.util.promise.resolve = function(value) {
//     return new this(function(resolve, reject) {
//         resolve(value);
//     });
// };

// synko.util.promise.reject = function(reason) {
//     return new this(function(resolve, reject) {
//         reject(reason);
//     });
// };





//////////  server/src/util/typeof.js


synko.util.typeof = function(value) {

    var s = typeof value;

    if ( s == 'object' ) {
        if (value) {
            if (Array.isArray( value ))
                s = 'array';
            else if ( value instanceof Date )
                s = 'date';
            else if ( value instanceof RegExp )
                s = 'regexp';
        }
        else
            s = 'null';
    }
    return s;

};


/*
synko.util.typeof = (function() {
    
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






//////////  server/src/connector/socketio.js

// http://socket.io/docs/server-api/
synko.socketio = function ( options, on ) {

    options.connector = options._connector; // Need it because socketio accept the option connector as parameter natively

    var socket_server = new synko.socketio.api( options.httpServer, options );

    if (typeof options.httpServer == 'undefined') {

        if (typeof options.port != 'number')
            options.port = synko.port;

        socket_server.listen( options.port );

    }

    socket_server.of( options.namespace ).on('connection', function( user ){

        user.emit('open');

        user.on('message', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

        user.send = synko.socketio.send;

        user.close = synko.socketio.close;

        on.open( user );

    });


    return socket_server;

};

synko.socketio.api = require('socket.io');
synko.socketio.name_connector = 'socketio';

synko.socketio.send = function( data ) {
    this.emit('message', data);
};
synko.socketio.close = function( ) {
    this.disconnect();
};



/*

Url-Server: /synko
Url-Client: http://localhost:9999/synko

*/








//////////  server/src/connector/sockjs.js

// https://github.com/sockjs/sockjs-node
synko.SockJS = function ( options, on ) {

    if (typeof options.httpServer == 'undefined')
        throw Error('The connector SockJS needs the parameter httpServer passed in the options');

    options.prefix = options.namespace;

    var socket_server = synko.SockJS.api.createServer( options );

    socket_server.on('connection', function(user) {

        user.on('data', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        user.send = synko.SockJS.send;

        on.open( user );

    });

    socket_server.installHandlers( options.httpServer, options );

    return socket_server;

};

synko.SockJS.api = require('sockjs');
synko.SockJS.name_connector = 'SockJS';

synko.SockJS.send = function( data ) {
    this.write( data );
};



/*

Url-Server: /synko
Url-Client: /synko

Url-Server: /synko
Url-Client: http://localhost:9999/synko

*/







//////////  server/src/connector/ws.js

// https://github.com/websockets/ws
synko.ws = function ( options, on ) {

    if (typeof options.httpServer != 'undefined')
        options.server = options.httpServer;

    else if (typeof options.port != 'number')
        options.port = synko.port;


    var socket_server = new synko.ws.api.Server( options );

    socket_server.on('connection', function( user ){

        user.on('message', function(message) {
            on.message( user, message );
        });

        user.on('close', function() {
            on.close( user );
        });

        on.open( user );

    });


    return socket_server;

};

synko.ws.api = require('ws');
synko.ws.name_connector = 'ws';



/*

Url-Server: prefix cant be setted
Url-Client: ws://localhost:4444

*/



