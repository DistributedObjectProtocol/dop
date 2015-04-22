
var EventEmitter = require('events').EventEmitter;

module.exports = syncio = {
	VERSION: '0.1.0',
	NAME: 'syncio',
	sockjs: require('sockjs'),
	app: {},
	scope: {},
	client: {},
};

