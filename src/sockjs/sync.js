

SockJS.prototype.sync = function(httpserver, options) {

	if (typeof options !== 'object')

		options = {};

	options.prefix = app_name;

	this.installHandlers(httpserver, options);

};