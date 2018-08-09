dop.set = function(object, property, value, options) {
    // dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    dop.isRegistered(object)
        ? dop.core.set(object, property, value, options)
        : (object[property] = value)
    return value
}
