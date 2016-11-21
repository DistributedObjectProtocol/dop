
dop.listen = function(options) {

    var args = Array.prototype.slice.call(arguments, 0);

    if (dop.util.typeof(args[0]) != 'object')
        options = args[0] = {};

    if (typeof options.transport != 'function')
        options.transport = require('dop-transports').listen.websocket;

    if (typeof options.try_connects != 'number' || options.try_connects<0)
        options.try_connects = 99;

    return new dop.core.listener(args);
};