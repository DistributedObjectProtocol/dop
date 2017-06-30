
dop.register = function(object) {
    dop.util.invariant(dop.isObjectRegistrable(object) && !isArray(object), 'dop.register needs a regular plain object as first parameter');
    return (dop.isRegistered(object)) ?
        dop.getObjectProxy(object)
    :
        dop.core.configureObject(object, dop.data.object_inc++);
};
