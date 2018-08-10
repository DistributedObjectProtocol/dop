dop.computed = function(callback) {
    dop.util.invariant(
        isFunction(callback),
        'dop.computed needs a function as first parameter'
    )
    var f = function(object, property, shall_we_set, old_value) {
        return dop.core.createComputed(
            object,
            property,
            callback,
            shall_we_set,
            old_value
        )
    }
    f._name = dop.cons.COMPUTED_FUNCTION
    return f
}
