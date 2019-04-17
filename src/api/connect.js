dop.connect = function(options) {
    if (dop.util.typeof(options) != 'object') options = {}

    if (options.transport === undefined)
        options.transport = dop.core.getDefaultConnectTransport()

    var transport =
        typeof options.transport == 'function'
            ? options.transport(options)
            : options.transport

    return new Promise(function(resolve) {
        transport.on(dop.cons.EVENT_CONNECT, resolve)
    })
}
