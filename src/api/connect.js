dop.connect = function(options) {
    if (dop.util.typeof(options) != 'object') options = {}

    if (options.transport === undefined)
        options.transport = dop.getDefaultConnectTransport()

    var transport =
        typeof options.transport == 'function'
            ? options.transport(dop, options)
            : options.transport

    return new Promise(function(resolve, reject) {
        transport.on(dop.cons.EVENT_CONNECT, resolve)
        transport.on(dop.cons.EVENT_ERROR, function(node_socket, error) {
            reject(error)
        })
    })
}
