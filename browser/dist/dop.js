



//////////  browser/src/dop.js
'strict';

var dop = { 
    version: '0.8.0',
    name: 'dop',
    side: 'api',

    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$DOP_REMOTE_FUNCTION',

    util: {},
    on: {},
    _on: {},
    objects: {}
};



if ( typeof module == 'object' && module )
    module.exports = dop;




//////////  browser/src/util/arguments.js

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





//////////  browser/src/util/emitter.js


dop.util.emitter = function() {

    this._events = {};

};

dop.util.emitter.prototype.on =
dop.util.emitter.prototype.addListener = function( name, callback, once ) {

    if ( typeof callback == 'function' ) {

        if ( typeof this._events != 'object' )
            this._events = {};

        if ( typeof this._events[name] != 'object' )
            this._events[name] = [];

        this._events[name].push(
            (once === true) ? [ callback, true ] : [ callback ]
        );

    }

    return this;

};

dop.util.emitter.prototype.once =
dop.util.emitter.prototype.addOnceListener = function( name, callback ) {

    return this.on( name, callback, true );

};



dop.util.emitter.prototype.emit = function( name ) {

    if ( typeof this._events[name] == 'object' && this._events[name].length > 0 ) {

        for ( var i=0, fun=[], args=Array.prototype.slice.call( arguments, 1 ); i < this._events[name].length; i++ ) {

            fun.push( this._events[name][i][0] );

            if ( this._events[name][i][1] === true ) {
               this._events[name].splice( i, 1 ); 
               i -= 1;
            }

        }

        for ( i=0; i < fun.length; i++ )
            fun[i].apply(this, args);

    }

    return this;

};




dop.util.emitter.prototype.removeListener = function( name, callback ) {

    if ( typeof this._events[name] == 'object' && this._events[name].length > 0 ) {

        for ( var i=0; i < this._events[name].length; i++ ) {

            if ( this._events[name][i][0] === callback ) {
                this._events[name].splice( i, 1 ); 
                i -= 1;
            }

        }


    }

    return this;

};





/*
name = 'T@!#asty ';
emitter = new require('events').EventEmitter();
emitter = new dop.util.emitter();

emitter.on(name, function(){
    console.log('AAA', arguments.length); 
})

cached = function () { console.log('BBB',this._events[name].length); emitter.removeListener(name, cached) };
emitter.on(name, cached);
emitter.on(name, cached);

emitter.once(name, function(){
    console.log('CCC', this._events[name].length); 
})


emitter.emit(name);
emitter.emit(name, 2, 3);
emitter.emit(name, 4);
*/




//////////  browser/src/util/get.js


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







//////////  browser/src/util/merge.js

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







//////////  browser/src/util/path.js

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




//////////  browser/src/util/promise.js


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





//////////  browser/src/util/typeof.js


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






//////////  browser/src/core/create.js


dop.create = function( options ) {

    return new dop.api( options );

};




//////////  browser/src/core/api.js


dop.api = function( options ) {    


    if (dop.util.typeof(options) != 'object')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = dop.ws;

    // Creating default url
    if (typeof options.url != 'string')
        options.url = window.location.href;

    // Gettin data from url
    var url_data = /(ps|ss)?:\/\/([^/]+)?(?:\/([^/]+))?/.exec(options.url);

    // Adding default prefix
    if (typeof url_data[3] == 'string')
        options.prefix = url_data[3];

    if (typeof options.prefix != 'string')
        options.prefix = dop.name;

    options.prefix += options.connector.name_connector;

    if (typeof url_data[3] == 'undefined') {
        if ( options.url[options.url.length-1] !== '/')
            options.url += '/';
        options.url += options.prefix;
    }
    else
        options.url += options.connector.name_connector;;

    // Storing host
    options.host = url_data[2];

    // Is SSL protocol?
    options.ssl = (typeof url_data[1] == 'string' && (url_data[1].toLowerCase() === 'ps' || url_data[1].toLowerCase() === 'ss'));




    this.options = options;
    this.options.stringify_function = dop.stringify_function;
    this.options.stringify_undefined = dop.stringify_undefined;
    this.options.stringify_regexp = dop.stringify_regexp;




    this.objects = {
        // object: 
        // name: 
        // writable: 
    };
    this.objects_name = {
        // object: 
        // promise: 
        // request: 
    };


    this.requests_inc = 1;
    this.requests = {
        // id:
        // data:
        // promise:
    };

    this.dop = this; // Alias needed for shared methods server&client side. As api/request.js - user/request.js

    this.observe = dop.observe.bind(this);

    this.send = function ( data ) {
        this.connector.send( data );
    };

    this.close = function () {
        this.connector.close();
    };

    // Constructor emitter
    dop.util.emitter.call( this );

};

// Extending from EventEmitter
dop.api.prototype = Object.create(
    (typeof EventEmitter == 'function') ? 
        EventEmitter.prototype
    :
        dop.util.emitter.prototype
);





//////////  browser/src/core/configure.js

// Configure a new object with the remote callbacks ~PATH and observe if is observable
dop.configure = function( object, path, isobservable ) {

    var that = this;

    Object.defineProperty( object, dop.key_object_path, {value: path} );

    // if ( isobservable )
        // Object.observe( object, this.observe );

    dop.util.path( object, function(subpath, value, key, obj ) {

        var newpath = path.concat(subpath);

        if ( value === that.options.stringify_function )
            obj[key] = dop.remoteFunction.call( that, newpath );

        if ( value !== null && typeof value == 'object' && typeof value[dop.key_object_path] == 'undefined' ) {
        
            Object.defineProperty( value, dop.key_object_path, {value: newpath} );
            
            // if ( isobservable )
                // Object.observe( value, that.observe );

        }

    });

};




/*

dop.api.prototype.observe = function(changes) {

    for (var i=0; i<changes.length; i++) {
        
        var path = changes[i].object._path.slice(0);
        path.push( changes[i].name )

        if (
            (changes[i].type == 'update' || changes[i].type == 'add') &&
            changes[i].object[changes[i].name] !== null &&
            typeof changes[i].object[changes[i].name] == 'object'
        ) {
            dop.observe(changes[i].object[changes[i].name], tcallback_observer, path );
        }

        console.log( changes[i].type, path, changes[i].oldValue );
        console.log()

    }

};




// setTimeout(function(){

MYSERVE = new dop.instance();
MYOBJECT = {
    foo: 0,
    bar: 1,
    obj: {
        paco: 2,
        pil: 3,
        arr: [1,2,3,4]
    }
};

dop.observe(MYOBJECT, MYSERVE.observe.bind(MYSERVE), [12345] );

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




//////////  browser/src/core/error.js


dop.error = {

    // REQUEST_UNIQUE: 'The id of the request should be unique (incrementing numericaly) for every request',

    SYNC_MUST_BE_OBJECT: 'The property "object" of the method sync() only accept Objects',
    SYNC_NO_REPEAT_NAME: 'You can not sync different objects with the same name',
    SYNC_NO_REPEAT: 'You can not sync the same object more than once',

    REJECT_CALL_NOT_EXISTS: 'You are trying to call a function does not exists',

    API_PARAMETER_CREATE_URL: 'You must pass url as first parameter',

};




//////////  browser/src/core/manage.js


dop.manage = function( user, messages ) {


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
            if (request_id > 0 && typeof dop.on[dop.protocol_keys[action]] == 'function' )
                dop.on[dop.protocol_keys[action]].call( this, user, request );


            // RESPONSE ===============================================================
            else {

                request_id *= -1;

                if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                    action = this.requests[ request_id ].data[1];

                    if ( request[1] === 0 )
                        dop._on[dop.protocol_keys[action]].call( this, user, request );

                    else
                        dop.on.reject.call( this, user, request );

                    // Removing request
                    if ( --this.requests[request_id].users === 0 )
                        delete this.requests[request_id];

                }

            }

        }

    }

};




//////////  browser/src/core/observe.js


dop.observe = function(changes) {

    for (var i=0; i<changes.length; i++) {
        
        var path = changes[i].object[dop.key_object_path].slice(0);
        
        path.push( changes[i].name );

        if (
            (changes[i].type == 'update' || changes[i].type == 'add') &&
            changes[i].object[changes[i].name] !== null &&
            typeof changes[i].object[changes[i].name] == 'object'
        ) {
            dop.configure.call(this, changes[i].object[changes[i].name], path, true );
        }

        // console.log( changes[i].type, path, changes[i].oldValue );
        // console.log()

    }

};





//////////  browser/src/core/parse.js


dop.parse = function parse(data) {

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
dop.parse.parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse




//////////  browser/src/core/protocol.js


dop.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send one request with multiple actions. And the response must respect the order sent
    // [<request_id>, [<action>, <params...>], [<action>, <params...>]]

    // Is possible send multiple requests in one message, just wrapping it in an Array. But the order of the responses is not fixed. Which means the response of request_idTwo could be resolved before request_idOne
    // [[<request_id1>, <action>, <params...>], [<request_id2>, <action>, <params...>]]

    // If the response has a 0 as second parameter, means the response it's fulfilled. Any other value is an error
    // [-1234, 0, <params...>]

    // Also the error response could be custom an string
    // [-1234, 'My custom message error']

    // Sending the same request without parameters means a cancel/abort of the request
    // [1234]



    fulfilled: 0,


                        // Server
    connect: 0,         // [ 1234, 0, <user_token>, {'~F':'$custom_F','~U':'$custom_U','~R':'$custom_R'}]
                        // [-1234, 0]


    sync: 1,            // [ 1234, 1, <ref_id>, <name_or_id>, <data_object_merged>]
                        // [-1234, 0, <ref_id>, <writable 0|1>, <data_object>, <changes_int>]


    unsync: 2,          // [ 1234, 2, <object_id>]
                        // [-1234, 0]


    call: 3,            // [ 1234, 3, [<object_id>, 'path','path'], [<params...>]]
                        // [-1234, 0, [<params...>]]


    set: 4,             // [ 1234, 4, [<object_id>, 'path','path'], 'value']
                        // [ 1234, 4, [<object_id>, 'path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]


    delete: 5,          // [ 1234, 5, [<object_id>, 'path','path']]
                        // [ 1234, 5, [<object_id>, 'path','path'], 'oldvalue']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]

    request: 6,         // [ 1234, 6, [<params...>]]
                        // [-1234, 0, [<params...>]]


};


dop.protocol_keys = {};
for (var key in dop.protocol)
    dop.protocol_keys[ dop.protocol[key] ] = key;







//////////  browser/src/core/reject.js


dop.reject = function() {

    return dop.response( 'reject', arguments );

};




//////////  browser/src/core/remoteFunction.js

// Create a remote function
dop.remoteFunction = function ( path ) {

    var that = this;
    return function $DOP_REMOTE_FUNCTION() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new Function(
    //     "return function " + dop.name_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};




//////////  browser/src/core/request.js

// Create a new request
dop.request = function ( request_data ) {

    var request_id = this.requests_inc++;
    request_data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: request_data, 
        promise: new dop.util.promise(),
        users: 1
    };

};




//////////  browser/src/core/resolve.js


dop.resolve = function() {

    return dop.response( 'resolve', arguments );

};




//////////  browser/src/core/response.js


dop.response = function( action, params ) {

    var promise;

    return dop.util.arguments( params, function( args ) {

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

dop.response.resolve = function() {

    this.response.push( Array.prototype.slice.call( arguments, 0 ) );

    this.user.send( dop.stringify.call(this.user.dop, this.response ) );

};

dop.response.reject = function( error ) {

    this.response[1] = error;

    this.user.send( dop.stringify.call(this.user.dop, this.response ) );

};









// function fun( a, b ) {

//     return (function() {
//         return (function() {
//              return dop.resolve( a*b );
//         })();
//     })();

// }


// var o={
//     reject: function(){},
//     response: {},
//     resolve: function dop_resolve( result ){
//         console.log('resolved1', result);
//     }
// };
// var o2={
//     reject: function(){},
//     response: {},
//     resolve: function dop_resolve( result ){
//         console.log('resolved2', result);
//     }
// };

// console.log(2, fun(5,5, o) );
// console.log(3, fun(5,5, o) );






//////////  browser/src/core/stringify.js


dop.stringify = function(data) {

    var that = this, tof;

    return JSON.stringify(data, function(k, v) {

        tof = typeof v;

        if (tof == 'undefined')
            return that.options.stringify_undefined;

        else if (tof == 'function' && v.name !== dop.name_remote_function)
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
// stringify=dop.stringify.bind(instance);
// to = stringify(types);
// parse=dop.parse.bind(instance);
// from = parse(to);


// console.log(types);
// console.log(to);
// console.log(from);










//////////  browser/src/api/call.js

// call method
dop.api.prototype.call = function( path, params ) {

    var data = [ dop.protocol.call, path, params ],
        request = dop.request.call( this, data );

    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;
    
};




//////////  browser/src/api/connect.js


dop.api.prototype.connect = function( ) {

    this.connector = this[this.options.connector.name_connector] = this.options.connector( this.options, {

        open: dop.on.open.bind(this),

        message: dop.on.message.bind(this),

        close: dop.on.close.bind(this),

        error: dop.on.error.bind(this)

    });

    this.connected = new dop.util.promise(); // Promise fullfiled when the user is connected with the token

    return this.connected;

};




//////////  browser/src/api/delete.js


dop.api.prototype.delete = function( object, key ) {

    return this.set( object, key );

};




//////////  browser/src/api/request.js

// Send a new request
dop[dop.side].prototype.request = function() {

    var data = [ dop.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = dop.request.call( this.dop, data );

    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;
    
};




//////////  browser/src/api/set.js


dop.api.prototype.set = function( object, key, value ) {

    // If writable

    
    if ( dop.util.typeof( object[dop.key_object_path] ) != 'array' ) {
        // error
    }

    var old_value = object[key],
        path = object[dop.key_object_path].slice(0),
        data = [ dop.protocol.set, path, old_value ];
        path.push( key );
    

    if ( arguments.length == 3)
        data.push( value );

    var request = dop.request.call( this, data );
    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;

};

















//////////  browser/src/api/sync.js


dop.api.prototype.sync = function(object_name, object) {

    var promise = new dop.util.promise();
        object_name = object_name.trim();

    // Must be an object
    if ( !object || typeof object != 'object' )
        throw new TypeError( dop.error.SYNC_MUST_BE_OBJECT );

    if ( object && typeof object == 'object' && dop.util.typeof( object[dop.key_object_path] ) == 'array' )
        throw new TypeError( dop.error.SYNC_NO_REPEAT );

    // If the object object_name does not exists yet we have to wait until the server send the object
    if ( typeof this.objects_name[ object_name ] == 'undefined' )
        this.objects_name[ object_name ] = {object:object, promise:promise};

    // If we already have the object remote
    else if ( typeof this.objects_name[ object_name ].request == 'object' && typeof this.objects_name[ object_name ].object == 'undefined' ) {
        this.objects_name[ object_name ].promise = promise;
        dop.on.sync.resolve.call( this, this.objects_name[ object_name ].request, object);
    }

    else
        throw new TypeError( dop.error.SYNC_NO_REPEAT_NAME );

    return this.objects_name[ object_name ].promise;

};

















//////////  browser/src/on/_call.js


dop._on.call = function( user, response ) {

    this.requests[ response[0]*-1 ].promise.resolve.apply( this, response[2] );

};




//////////  browser/src/on/_connect.js


dop._on.connect = function( user, request ) {

    this.token = request[2];

    if ( typeof request[3] == 'object' ) {

        if ( typeof request[3][dop.stringify_function] == 'string' )
            this.options.stringify_function = request[3][dop.stringify_function];

        if ( typeof request[3][dop.stringify_undefined] == 'string' )
            this.options.stringify_undefined = request[3][dop.stringify_undefined];

        if ( typeof request[3][dop.stringify_regexp] == 'string' )
            this.options.stringify_regexp = request[3][dop.stringify_regexp];

    }

    this.connected.resolve( this.token );

};




//////////  browser/src/on/_request.js


dop._on.request = function( user, response ) {

    this.requests[ response[0]*-1 ].promise.resolve.apply( this, response[2] );

};




//////////  browser/src/on/call.js


dop.on.call = function( user, request ) {
    
    var response = [ request[0] * -1 ];

    if (dop.util.typeof( request[2] ) == 'array' ) {
        
        var path = request[2],
            object_id = path.shift();

        if ( typeof this.objects[ object_id ] == 'object' ) {
            
            var fn = dop.util.get( this.objects[ object_id ].object, path );
            if ( typeof fn == 'function' ) {

                response.push( dop.protocol.fulfilled );

                var params = request[3],
                
                promise = { request: request, response: response, user: user };
                promise.resolve = dop.response.resolve.bind( promise );
                promise.reject = dop.response.reject.bind( promise );

                params.push( promise );

                return fn.apply( this.objects[ object_id ].object, params );

            }

        }
    
    }

    response.push( dop.error.REJECT_CALL_NOT_EXISTS );

    user.send( JSON.stringify( response ) );

};




//////////  browser/src/on/close.js


dop.on.close = function() {

    this.emit( 'close' );

};




//////////  browser/src/on/error.js


dop.on.error = function( error ) {

    this.emit( 'error', error );

};




//////////  browser/src/on/message.js


dop.on.message = function( message_raw ) {

    var messages;

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = dop.parse.call(this, message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', messages, message_raw );


    // Managing protocol
    if ( dop.util.typeof( messages ) == 'array' )
        dop.manage.call( this, this, messages );


};




//////////  browser/src/on/open.js


dop.on.open = function() {

    var request = dop.request.call( this, [] );

    request.data.push( dop.protocol.connect );

    this.send( JSON.stringify( request.data ) );

};




//////////  browser/src/on/reject.js


dop.on.reject = function( user, response ) {

    this.requests[ response[0]*-1 ].promise.reject.call( this, response[1] );

};




//////////  browser/src/on/request.js


dop.on.request = function( user, request ) {

    var response = [ request[0] * -1, dop.protocol.fulfilled ];

    var promise = { request: request, response: response, user: user };
    promise.resolve = dop.response.resolve.bind( promise );
    promise.reject = dop.response.reject.bind( promise );

    var params = [ 'request' ];
    params = params.concat( request[2] );
    params.push(promise);

    this.emit.apply(this, params );

};




//////////  browser/src/on/sync.js


dop.on.sync = function( user, request ) {

    // Getting info
    var object_name = request[5],
        object = request[4];



    // The function sync(object_name) it has been executed, so we resolve the syncronization
    if ( typeof this.objects_name[ object_name ] == 'object' ) {

        if ( typeof this.objects_name[ object_name ].object == 'object' )
            object = this.objects_name[ object_name ].object;

        // Resolve promise
        dop.on.sync.resolve.call( this, request, this.objects_name[ object_name ].object );

    }

    // We have to wait until the client run sync(object_name)
    else
        this.objects_name[ object_name ] = {request: request};




    this.emit( 'sync', object_name, object, request[2], request[3]===1 );


};




dop.on.sync.resolve = function( request, object  ) {

    var request_id = request[0] * -1,
        object_id = request[2],
        writable = request[3] === 1,
        object_remote = request[4],
        object_name = request[5],
        response;
        
    if ( object && typeof object == 'object') {
        response = dop.stringify.call(this, [request_id, dop.protocol.fulfilled, object] );
        // if (writable) {
            // response.push
        response = response.replace(/,\s*(({\s*}\s*])|(\[\s*\]\s*]))$/, ']'); // In case the object is empty
        object = dop.util.merge( object, object_remote );
    }
    else {
        object = object_remote;
        response = dop.stringify.call(this, [request_id, dop.protocol.fulfilled] );
    }



    // Configure object, adding ~PATH and observe
    dop.configure.call(
        this,
        object, 
        [object_id], 
        writable
    );

    this.objects[ object_id ] = {object: object, name: object_name, writable: writable};

    this.objects_name[ object_name ].object = object;

    this.objects_name[ object_name ].promise.resolve( object, object_id, writable );

    this.send( response );

};


/*

sync() NO 
 * crea promesa
 * guarda objeto

 sync() SI
 * crea promesa
 * merge con objeto pasado
 * configura objeto
 * save this.objects_id
 * resuelve promesa
 * response



 onsync() NO
 * guarda request
 * emit

 onsync() SI
 * merge con objeto pasado
 * configura objeto
 * save this.objects_id
 * resuelve promesa
 * emit
 * response





*/






//////////  browser/src/connector/socketio.js


dop.socketio = function( options, on ) {

    var socket = dop.socketio.api( options.url );

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

dop.socketio.name_connector = 'socketio';
dop.socketio.api = window.io;




//////////  browser/src/connector/sockjs.js


dop.SockJS = function( options, on ) {

    var socket = new dop.SockJS.api( options.url, undefined, options );

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

dop.SockJS.name_connector = 'SockJS';
dop.SockJS.api = window.SockJS;



// SockJS.prototype.reconnect = function() {

//     if (this.readyState != 1)

//         SockJS.call(this, this._base_url, this._options );

// };




//////////  browser/src/connector/ws.js


dop.ws = function( options, on ) {

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

dop.ws.name_connector = 'ws';
dop.ws.api = WebSocket;