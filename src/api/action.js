dop.action = function(func) {
    return function() {
        var collector = dop.collect()
        func.apply(this, arguments)
        collector.emit()
    }
}
