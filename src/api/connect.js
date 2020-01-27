dop.connect = function(options) {
    if (dop.util.typeof(options) != 'object') options = {}

    if (options.transport === undefined)
        options.transport = dop.getDefaultConnectTransport()

    return typeof options.transport == 'function'
        ? options.transport(dop, options)
        : options.transport
}
