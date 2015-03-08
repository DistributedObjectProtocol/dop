

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
