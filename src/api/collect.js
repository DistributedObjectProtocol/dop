dop.collect = function(index_function) {
    dop.util.invariant(
        arguments.length == 0 ||
            (arguments.length == 1 && isFunction(index_function)),
        'dop.collect only accept one argument as function'
    )
    var index = index_function
        ? index_function(dop.data.collectors)
        : dop.data.collectors.length
    return dop.core.createCollector(dop.data.collectors, index)
}
