dop.action = function(f) {
    dop.util.invariant(
        isFunction(f),
        'dop.action only accept one argument as function'
    )
    return function() {
        var collector = dop.core.createCollector(dop.data.collectors, 0)
        var output = f.apply(this, arguments)
        collector.emit()
        return output
    }
}
