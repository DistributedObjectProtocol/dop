



//////////  src/syncio.js


var syncio = {
	VERSION: '0.1.0',
	NAME: 'syncio'
};

var sockjs = require('sockjs');

var EventEmitter = require('events').EventEmitter;




//////////  src/core/create.js


syncio.createServer = function( http_server, options ) {

	var server = sockjs.createServer( options );

	server.http_server = http_server;

	server.app = {};

	server.createApp = syncio.createServer.create;

	server.on('connection', syncio.createServer.connection);

	return server;

};
syncio.createServer.create = function() {

	return syncio.createApp.apply(this, arguments);

};
syncio.createServer.connection = function(client) {

	var app = this.app[client.prefix.slice(1)];

	client.app = app;

	client.scopes = [];

	console.log( app.data );

	client.scope = function( scope ) {
		//console.log( this );
	};

	app.emit('connection', client);

};









syncio.createApp = function( name, data, options ) {

	if (typeof this.app[name] != 'undefined')
		return this.app[name];

	if (typeof name == 'undefined')
		name = syncio.NAME;

	if (typeof data == 'undefined')
		data = {};

	if (typeof options == 'undefined')
		options = {};

	if (typeof options.http_server == 'undefined')
		options.http_server = this.http_server;



	options.prefix = '/' + name;

	this.installHandlers(options.http_server, options);



	var app = this.app[name] = new EventEmitter();

	app.server = this;

	app.request_id = 0;

	app.name = name;

	app.data = data;

	app.scope_id = {};

	app.scope = [];

	app.client_index = 0;

	app.client = {};

	app.createScope = syncio.createApp.create;



	return app;

};
syncio.createApp.create = function() {

	return syncio.createScope.apply(this, arguments);

};














syncio.createScope = function( name, data_scope, data_client ) {

	var scope = {

		app: this,

		name: name,

		data: data_scope,

		data_client: data_client,

		clients: []

	};

	scope.index = this.scope.push(scope)-1;

	this.scope_id[name] = scope.index;

	return scope;

};









//////////  src/core/merge.js

// Based on: https://github.com/unclechu/node-deep-extend (Performace: http://jsperf.com/deepmerge-comparisions/2)
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


// var obj1 = {
// 	a: 11,
// 	b: 12,
// 	array: [1,2,3,{abc:123}],
// 	d: {
// 		d1: 13,
// 		d2: {
// 			d21: 123,
// 			d22: {
// 				d221: 12,
// 				d223: { 
// 				  hola: 'hola',
// 				  static: 'static'
// 				}
// 			}
// 		}
// 	},
// 	f: 5,
// 	g: 123
// };
// var obj2 = {
// 	b: 3,
// 	c: 5,
// 	obj: {lolo:111},
// 	fun: function(){},
// 	arr: [1,2,3,{La:123}],
// 	array: [567],
// 	d: {
// 		d2: {
// 			d22: {
// 				d222: 25,
// 				d223: {
// 				  hola:'mundo'
// 				}
// 			}
// 		}
// 	},

// };
// r=syncio.merge({},obj2,obj1)
// //r=deepExtend(obj1, obj2)
// console.log( r.obj === obj2.obj );
// console.log( r.fun === obj2.fun );
// console.log( r.arr === obj2.arr );
// console.log( r );





//////////  src/core/protocol.js


// [<type>, <request_id>, <scope_id>, <action>, <params...>]

syncio.protocol = {


	// <type>
	request: 0,
	response: 1,
	error: 2,


	// <scope_id>
	all: -1,			// [<type>, <request_id>, -1, <action>, {o: 'hello', b: 'world', method: '{$}'}]


	// <action>
	sync: 0,			// [<type>, <request_id>, <scope_id>, 0, {o: 'hello', b: 'world', method: '{$}'}]
	set: 1, 			// [<type>, <request_id>, <scope_id>, 1, ['path','path'], 'value']
	get: 2, 			// [<type>, <request_id>, <scope_id>, 2, ['path','path'], param, param]
	delete: 3,


	// Datatypes
	func: '{f}',
	date: '{123123141}',


};




//////////  src/export.js


syncio.sockjs = sockjs;

module.exports = syncio;