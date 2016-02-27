



//////////  src/dop.js


var dop = {
    version: '0.9.0',
    name: 'dop',
    port: 4444,

    // keys
    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$DOP_REMOTE_FUNCTION',

    // Api
    util:{},
    on:{},
    _on:{},
    listener:{},
    connector:{},

    // Data
    node_inc:0,
    node:{},
    object_inc:0,
    objects:{},
};


if ( typeof module == 'object' && module )
    module.exports = dop;




//////////  src/api/connect.js





//////////  src/api/listen.js


dop.listen = function ( options ) {

    this.options = (dop.util.typeof(options) == 'object') ? options : {};
    this.options.encode_params = {};

    if (typeof this.options.listener != 'function')
        this.options.listener = dop.listener.ws;

    if (typeof this.options.namespace != 'string')
        this.options.namespace = '/' + dop.name;

    // Adding connector name to the end of the prefix/namespace
    this.options.namespace += this.options.listener._name;


    // Adding encode properties
    if (typeof this.options.encode_function != 'string')
        this.options.encode_function = synko.encode_function;
    else
        this.options.encode_params[synko.encode_function] = this.options.encode_function;

    if (typeof this.options.encode_undefined != 'string')
        this.options.encode_undefined = synko.encode_undefined;
    else
        this.options.encode_params[synko.encode_undefined] = this.options.encode_undefined;

    if (typeof this.options.encode_regexp != 'string')
        this.options.encode_regexp = synko.encode_regexp;
    else
        this.options.encode_params[synko.encode_regexp] = this.options.encode_regexp;



    var on = {

        open: dop.on.open.bind( this ),

        message: dop.on.message.bind( this ),

        close: dop.on.close.bind( this )

    };



};




//////////  src/on/close.js


dop.on.close = function( user_socket ){

    var user = this.users[ user_socket[dop.key_user_token] ]

    if ( typeof user_socket[dop.key_user_token] == 'string' ) {

        var object_name, object_id;

        for ( object_name in user.objects ) {

            object_id = user.objects[object_name][dop.key_object_path][0];

            // Remove object
            if ( dop.objects[ object_id ].subscribed == 1) // The object only have one user subscribed
                delete dop.objects[ object_id ];

            // Remove user listener from the object
            else {
                dop.objects[ object_id ].subscribed--;
                delete dop.objects[ object_id ].users[ user.token ];
            }

        }

        this.emit( 'disconnect', user );

        // Remove user
        delete this.users[ user.token ];

    }

    this.emit( 'close', user_socket );

};




//////////  src/on/message.js


dop.on.message = function( user_socket, message_raw ) {

    var messages, 
        user = (typeof user_socket[dop.key_user_token] == 'undefined' ) ?
            user_socket
        :
            this.users[ user_socket[dop.key_user_token] ];

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = dop.parse.call(this, message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', user, messages, message_raw );


    // Managing OSP protocol
    if ( dop.util.typeof( messages ) == 'array' )
        dop.core.manage.call( this, user, messages );

};




//////////  src/on/open.js


dop.on.open = function( user_socket ){

    this.emit( 'open', user_socket );

};




//////////  src/node/call.js

// Send a new request
dop.node.prototype.call = function( path, params ) {

    var data = [ dop.protocol.call, path, params ],
        request = dop.request.call( this.dop, data );

    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;
    
};




//////////  src/node/close.js


dop.node.prototype.close = function() {
    return this.socket.close();
};




//////////  src/node/request.js

// Send a new request
dop.node.prototype.request = function() {

    var data = [ dop.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = dop.request.call( this.dop, data );

    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;
    
};




//////////  src/node/send.js


dop.node.prototype.send = function( message ) {
    return this.socket.send( message );
};




//////////  src/node/sync.js


dop.node.prototype.sync = function( object_name, object, options ) {

    var user = this,
        instance = this.dop;
        object_name = object_name.trim(),
        object_id;

    // If the user already is subscribed to this object
    if ( typeof user.objects[object_name] == 'object' )
        throw new TypeError( dop.error.SYNC_NO_REPEAT_NAME );

    // Must be an object
    if ( typeof object != 'object' )
        throw new TypeError( dop.error.SYNC_MUST_BE_OBJECT );


    if (typeof options != 'object')
        options = {};

    if (typeof options.writable != 'boolean')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable != 'boolean')
        options.observable = false; // user/client can edit it from the browser



    // If the object doesn't exist yet
    if ( dop.util.typeof( object[dop.key_object_path] ) != 'array' ) {

        object_id = dop.object_inc++;

        dop.configure.call(
            instance,
            object, 
            [object_id]
        );

        dop.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable}; // users is an objects of the users than are subscribed to this object

    }


    // If the object is already registered
    else {

        // Checking if the object is inside into another object already synced
        if ( object[dop.key_object_path].length > 1 )
            throw new TypeError( dop.error.SYNC_NO_INNER );

        // we get the object_id
        var object_id = object[dop.key_object_path][0];

        // Checking if the object is registered correctly on the same instance of dop
        if ( typeof dop.objects[ object_id ] == 'undefined')
            dop.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable};
        
    }


    dop.objects[ object_id ].users[ user.token ] = user;
    dop.objects[ object_id ].subscribed += 1;

    user.objects[object_name] = object;
    user.writables[object_id] = options.writable;


    var request = dop.request.call( instance, [
        dop.protocol.sync,
        object_id,
        options.writable*1, // false*1 === 0
        object,
        object_name
    ]);

    user.send( dop.stringify.call(instance, request.data) );
    return request.promise;

};




//////////  src/util/arguments.js

// This method find arguments from inside to outside, and if the callback return true will stop
dop.util.arguments = function( args, callback ) {

    var finder = args;

    while ( typeof finder.callee.caller == 'function' ) {

        if ( callback( finder.callee.caller.arguments ) )
            return args[0];

        else
            finder = finder.callee.caller.arguments;

    }

    return args[0];
    
};





//////////  src/util/get.js


dop.util.get = function ( obj, path, callback_create ) {

    for (var i=0, l=path.length, tof; i<l; i++) {

        tof = dop.util.typeof( obj[ path[i] ] );

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

dop.util.get.set = function ( obj, path, value, callback_create ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = dop.util.get(obj, path, callback_create);

    obj[prop] = value;

    return obj

};


dop.util.get.delete = function ( obj, path, callback_create ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = dop.util.get(obj, path);

    ( dop.util.typeof(obj) == 'array' && !isNaN(prop) ) ?
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
resu = dop.util.get(obj1, ['d', 'd2', 'd1','a'], function(obj, property, i){ 
    exists = false;
    // console.log(obj.hasOwnProperty(property), i); 
    return !obj.hasOwnProperty(property);  // If the path does not exists and we return true, the path will be create to set the property
    return false;
});

console.log('RESU:',exists,resu,obj1)

*/







//////////  src/util/merge.js

// Based on: https://github.com/unclechu/node-deep-extend (Performace: http://jsperf.com/deepmerge-comparisions/3)
dop.util.merge = (function() {

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
// console.log(dop.util.merge({},data));

// resu=dop.util.merge(obj1, obj2, );
// console.log( resu );
// console.log( resu.obj === obj2.obj );
// console.log( resu.fun === obj2.fun );
// console.log( resu.arr === obj2.arr );











// // Based in dop.util.path && dop.util.get.set
// dop.util.merge = (function() {

//     var destiny;

//     function callback(path, value){

//         if ( value && typeof value == 'object' )

//             value = (Array.isArray( value )) ? [] : {};

//         dop.util.get.set(destiny, path, value);

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

//         dop.util.path(second, callback);

//         return first;

//     };

// })();







//////////  src/util/path.js

// http://jsperf.com/stringify-path-vs-custom-path/2 - http://jsperf.com/stringify-path-vs-custom-path/3
dop.util.path = function (obj, callback) {

    dop.util.path.recursive.call({circular:[]}, obj, callback, []);

};
dop.util.path.recursive = function (obj, callback, path ) {

    for (var key in obj) {

        //if ( obj.hasOwnProperty(key) ) {
        
            path.push( key );

            if ( this.stop == false )
                return;

            this.stop = callback(path, obj[key], key, obj);

            // Avoiding circular loops
            if ( obj[key] && typeof obj[key] == "object" && obj[key] !== obj && this.circular.indexOf(obj[key])==-1 ) {

                this.circular.push(obj[key]);

                dop.util.path.recursive.call(this, obj[key], callback, path );

            }

            path.pop();

        //}

    }

};



// // http://jsperf.com/stringify-clousured-or-not - 
// dop.stringify_path = function(obj, callback) {

//     var path = [];

//     return JSON.stringify(obj, function(k,v){

//         if (v !== obj) {

//             while ( path.length>0 && dop.util.get(obj, path) !== this )
//                 path.pop();

//             path.push(k);

//         }

//         return (typeof callback == 'function') ? callback.call(this, k, v, path) : v;

//     });

// };




//////////  src/util/promise.js


dop.util.promise = function( resolver ) {

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

// dop.util.promise.resolve = function(value) {
//     return new this(function(resolve, reject) {
//         resolve(value);
//     });
// };

// dop.util.promise.reject = function(reason) {
//     return new this(function(resolve, reject) {
//         reject(reason);
//     });
// };





//////////  src/util/typeof.js


dop.util.typeof = function(value) {

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
dop.util.typeof = (function() {
    
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






//////////  src/side/browser/connector/socketio.js


dop.connector.socketio = function( options, on ) {

    var socket = dop.connector.socketio.api( options.url );

    socket.on('connect', function () {
        on.open();
    });

    socket.on('message', function ( message ) {
        on.message( message );
    });

    socket.on('disconnect', function () {
        on.close();
    });

    socket.on('error', function ( error ) {
        on.error( error );
    });

    return socket;

};

dop.connector.socketio._name = 'socketio';
dop.connector.socketio.api = window.io;




//////////  src/side/browser/connector/sockjs.js


dop.connector.SockJS = function( options, on ) {

    var socket = new dop.connector.SockJS.api( options.url, undefined, options );

    socket.addEventListener('open', function() {
        on.open();
    });

    socket.addEventListener('message', function( message ) {
        on.message( message.data );
    });

    socket.addEventListener('close', function() {
        on.close();
    });

    socket.addEventListener('error', function( error ) {
        on.error( error );
    });

    return socket;

};

dop.connector.SockJS._name = 'SockJS';
dop.connector.SockJS.api = window.SockJS;



// SockJS.prototype.reconnect = function() {

//     if (this.readyState != 1)

//         SockJS.call(this, this._base_url, this._options );

// };




//////////  src/side/browser/connector/ws.js


dop.connector.ws = function( options, on ) {

    var protocol = ( options.ssl ) ? 'wss' : 'ws';
    var socket = new WebSocket(protocol+'://'+options.host+'/' + options.prefix);

    socket.addEventListener('open', function() {
        on.open();
    });

    socket.addEventListener('message', function( message ) {
        on.message( message.data );
    });

    socket.addEventListener('close', function() {
        on.close();
    });

    socket.addEventListener('error', function( error ) {
        on.error( error );
    });

    return socket;

};

dop.connector.ws._name = 'ws';
dop.connector.ws.api = WebSocket;