dop.register = function(object) {
    dop.util.invariant(
        dop.isObjectRegistrable(object),
        'dop.register needs an object as first parameter'
    )
    return dop.isRegistered(object)
        ? dop.getObjectProxy(object)
        : dop.core.configureObject(object, dop.data.object_inc++)
}
