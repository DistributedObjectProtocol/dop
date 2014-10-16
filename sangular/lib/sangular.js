
(function() {

	var sockjs = require('sockjs');

	var App = function (app_name, options) {

		if (typeof app_name !== 'string' || app_name === '')
			app_name = 'sangular';

		var server = sockjs.createServer( options );
			server.clients = [];
		
		var value,
			get,
			decoded;


		decode = function( string ) {

			return ( decoded = string.match(/([0-9]+)(\w.*)/i) ) ?
				decoded.slice(1)
			:
				string.match(/([^:]+):(.+)/i).slice(1);

		};

		server.on('connection', function(client) {

			client.on('data', function( string ) {

				decoded = decode( string );


				if ( !isNaN(decoded[0]) ) { //Its a get, then

					get = eval('global.' + decoded[1]);

					if ( typeof get === 'function' )

						get = get();




					console.log(decoded, get)
					 
				}

				//server.emit('data', client, decoded, string);

				//console.log(message)
				//(g|s):([^:]+):(.+)
				//client.write(message);

			});

		});


		// Method to connect the http server with the socket server
		server.connect = function(httpserver, options) {

			if (typeof options !== 'object')

				options = {};

			options.prefix = '/' + app_name;

			server.installHandlers(httpserver, options);

		}

		return server;
	};



	module.exports.app = function(app_name, options) {

		return new App(app_name, options);

	};



})();



