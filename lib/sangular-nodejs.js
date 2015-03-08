



//////////  src/sangular.js


var sangular = {};

var SockJS = require('sockjs');




//////////  src/core/create.js


sangular.createServer = function( options ) {

	var server = this.SockJS.createServer( options );

	server.on('connection', function(client) {

		client.on('data', function( string ) {

			server.emit('data', this, string );


			try {

				var data = JSON.parse(string);

				if ( data[1] == sangular.protocol.sync ) {

					server.emit('sync', this, data[2], data[0] );

					this.write(string);

				}
				else {

					server.emit('request', this, data[1], data[0] );

					this.write(string);

				}

			}
			catch(e) {}




		});

		client.on('close', function( ) {
			server.emit('close', this );
		});


	});

	return server;

};





//////////  src/core/protocol.js


sangular.protocol = {

	sync: 0,		// [123, 0, {o: 12, b: 34, j: 56}]
	set: 1, 		// [124, 1, ['path','path'], 'value']
	get: 2, 		// [125, 2, ['path','path'], param, param]

	func: '$f',		// 


};




//////////  src/sockjs/sync.js


SockJS.prototype.sync = function(httpserver, options) {

	if (typeof options !== 'object')

		options = {};

	options.prefix = app_name;

	this.installHandlers(httpserver, options);

};




//////////  src/export.js


sangular.SockJS = SockJS;

module.exports = sangular;