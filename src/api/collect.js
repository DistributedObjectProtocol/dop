dop.collect = function(index_function) {
    dop.util.invariant(
        arguments.length == 0 ||
            (arguments.length == 1 && isFunction(index_function)),
        'dop.collect only accept one argument as function'
    )
    var collectors = dop.data.collectors
    var index = index_function ? index_function(collectors) : collectors.length
    return dop.core.createCollector(collectors, index)
}
