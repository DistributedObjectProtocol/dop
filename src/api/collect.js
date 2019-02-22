dop.collect = function(index_function) {
    var is_function = isFunction(index_function)
    dop.util.invariant(
        arguments.length == 0 || (arguments.length == 1 && is_function),
        'dop.collect only accept one argument as function'
    )
    var collectors = dop.data.collectors
    var index = is_function ? index_function(collectors) : collectors.length
    return dop.core.createCollector(collectors, index)
}
