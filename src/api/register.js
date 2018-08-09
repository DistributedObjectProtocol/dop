dop.register = function(object) {
    dop.util.invariant(
        dop.isObjectRegistrable(object) && !isArray(object),
        'dop.register needs an object or an array as first parameter'
    )
    return dop.isRegistered(object)
        ? dop.getObjectProxy(object)
        : dop.core.configureObject(object, dop.data.object_inc++)
}
