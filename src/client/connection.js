

syncio.client.connection = function(client) {

	var app = this.app[client.prefix.slice(1)];

	client.app = app;

	client.scopes = [];

	client.request_id = 0;

	client.request = syncio.client.request.bind(client);

	client.request(syncio.protocol.request, syncio.protocol.connection, app.data);

	// console.log( app.data );

	// client.scope = function( scope ) {
	// 	//console.log( this );
	// };

	app.emit('connection', client);

};