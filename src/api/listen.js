dop.listen = function(options) {
    if (dop.util.typeof(options) != 'object') options = {}

    if (options.transport === undefined)
        options.transport = dop.core.getDefaultListenTransport()

    return typeof options.transport == 'function'
        ? options.transport(options)
        : options.transport
}
