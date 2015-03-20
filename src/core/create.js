

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




