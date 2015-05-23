



//////////  src/syncio.js

var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
    VERSION: '0.1.0',
    NAME: 'syncio',
    app: {},
    scope: {},
    client: {},
};






//////////  src/core/create.js


syncio.createServer = function( http_server, options ) {

    var server = syncio.sockjs.createServer( options );

    server.http_server = http_server;

    server.app = {};

    // PERF: We can make this as cached funcion (cuz is faster) http://jsperf.com/function-calls-direct-vs-apply-vs-call-vs-bind/62
    server.createApp = syncio.app.create.bind(server); 

    server.on('connection', syncio.client.connection);

    return server;

};




//////////  src/core/merge.js

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






//////////  src/core/protocol.js


syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is a response.




    // If the response have a 1 as second parameter means the response it's fulfilled
    // [-1234, 1, <params...>]

    // If the response have a second parameter defined as 0 means is an error on any case of the action's bellow
    // [-1234, 0, <code_error>]




    // <action>
    custom: 0,          // [ 1234, 0, <params...>]
                        // [ -1234, 1]

    sync: 1,            // [ 1234, 1, [<scope_name>, <scope_name>, ...], <password>]
                        // [-1234, 1, [[<scope_id>,<scope_data>], [<scope_id>,<scope_data>], ...]

    reconnect: 2,       // [ 1234, 2, [[<scope_id>,<last_request_id_server>], [<scope_id>,<last_request_id_server>], ...]]
                        // [ -1234, 1]

    set: 3,             // [ 1234, 3, <scope_id>, ['path','path'], 'value']
                        // [ -1234, 1]

    get: 4,             // [ 1234, 4, <scope_id>, ['path','path'], param, param]
                        // [-1234, 1, <data_returned>]

    delete: 5,          // [ 1234, 5, <scope_id>, ['path','path']]
                        // [ -1234, 1]

};









//////////  src/core/typeof.js

// http://javascript.crockford.com/remedial.html
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





//////////  src/core/wrap.js


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




//////////  src/app/create.js


syncio.app.create = function( name, options ) {


    if (typeof this.app[name] != 'undefined')
        return this.app[name];

    if (typeof name == 'undefined')
        name = syncio.NAME;

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.http_server == 'undefined')
        options.http_server = this.http_server;



    options.prefix = '/' + name;

    this.installHandlers(options.http_server, options);



    var app = this.app[name] = new EventEmitter();

    app.server = this;

    app.name = name;

    app.scope_name = [];

    app.scope = [];

    app.client_index = 0;

    app.client = {};

    app.createScope = syncio.scope.create.bind(app);



    return app;

};







//////////  src/scope/create.js


syncio.scope.create = function( name, data_scope, data_client ) {

    var scope = {

        app: this,

        name: name,

        data: data_scope,

        data_client: data_client,

        clients: []

    };

    scope.index = this.scope.push(scope)-1;

    this.scope_name.push(name);

    return scope;

};





//////////  src/client/connection.js


syncio.client.connection = function(client) {

    var app = this.app[client.prefix.slice(1)];

    client.app = app;

    client.scopes = [];

    client.request_id = 0;

    client.request = syncio.client.request.bind(client);

    client.request(syncio.protocol.request, syncio.protocol.connection, app.data);

    // console.log( app.data );

    // client.scope = function( scope ) {
    //     //console.log( this );
    // };

    app.emit('connection', client);

};




//////////  src/client/request.js


syncio.client.request = function( direction, action ) {

    // PERF: We can make this as basic forloop: http://jsperf.com/array-prototype-slice-call-vs-slice-call/17
    var data = Array.prototype.slice.call( arguments );

    data.unshift(this.request_id++);

    this.write(
        (action < 2) ? 
            JSON.stringify(data, syncio.protocol.stringify)
        :
            JSON.stringify(data)
    );

};




