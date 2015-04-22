

syncio.createServer = function( http_server, options ) {

	var server = syncio.sockjs.createServer( options );

	server.http_server = http_server;

	server.app = {};

	// PERF: We can make this as cached funcion (cuz is faster) http://jsperf.com/function-calls-direct-vs-apply-vs-call-vs-bind/62
	server.createApp = syncio.app.create.bind(server); 

	server.on('connection', syncio.client.connection);

	return server;

};