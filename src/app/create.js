

syncio.app.create = function( name, data, options ) {


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

	app.name = name;

	app.data = data;

	app.scope_name = [];

	app.scope = [];

	app.client_index = 0;

	app.client = {};

	app.createScope = syncio.scope.create.bind(app);



	return app;

};


