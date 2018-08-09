dop.onSubscribe = function(callback) {
    dop.util.invariant(
        isFunction(callback),
        'dop.onSubscribe only accept a function as parameter'
    )
    dop.data.onsubscribe = callback
}
