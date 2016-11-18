
dop.connect = function(options) {
    if (dop.util.typeof(options) != 'object')
        options = {};
    if (typeof options.transport != 'function')
        options.transport = dop.transport.connect.WebSocket;
    return dop.core.connector(options);
};