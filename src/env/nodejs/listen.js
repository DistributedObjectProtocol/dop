
dop.listen = function(options) {

    if (dop.util.typeof(options) != 'object')
        options = {};

    if (typeof options.transport != 'function')
        options.transport = require('../../dop-transports/javascript').listen.WebSocket; //require('dop-transports').listen.WebSocket;

    if (typeof options.try_connects != 'number' || options.try_connects<0)
        options.try_connects = 99;

    return new dop.core.listener(options);
};