dop.action = function(f, filterMutationsToNode) {
    dop.util.invariant(
        isFunction(f),
        'dop.action needs one argument as function'
    )
    return function() {
        var collectors = dop.data.collectors
        var collector = dop.core.createCollector(collectors, collectors.length)
        var output = f.apply(this, arguments)
        collector.emit(filterMutationsToNode)
        return output
    }
}
