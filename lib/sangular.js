
(function() {


	var sangular_obj = {};

	sangular_obj.sockjs = require('sockjs');

	sangular_obj.decode  = function( string ) {

		/*return ( decoded = string.match(/([0-9]+)(\w.*)/i) ) ?
			decoded.slice(1)
		:
			string.match(/([^:]+):(.+)/i).slice(1);*/

		return string;

	};

	sangular_obj.createApp = function(app_name, options) {

		return new app(app_name, options);

	};


	var app = function (app_name, options) {

		if (typeof app_name !== 'string' || app_name === '')
			app_name = '/sangular';


		var server = sangular_obj.sockjs.createServer( options );
			server.clients = [];



		server.on('connection', function(client) {

			client.on('data', function( string ) {

				var decoded = sangular_obj.decode( string );

				server.emit( 'data', string, decoded, client );



				// if ( !isNaN(decoded[0]) ) { //Its a get, then

				// 	get = eval('global.' + decoded[1]);

				// 	if ( typeof get === 'function' )

				// 		get = get();




				// 	console.log(decoded, get)
					 
				// }

				//

				//console.log(message)
				//(g|s):([^:]+):(.+)
				//client.write(message);

			});


			client.on('close', function( string ) {
				server.emit('close', client );
			});

		});


		// Method to connect the http server with the socket server
		server.connect = function(httpserver, options) {

			if (typeof options !== 'object')

				options = {};

			options.prefix = app_name;

			server.installHandlers(httpserver, options);

		};

		return server;
	};



	module.exports = sangular_obj;


})();



