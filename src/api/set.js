
dop.set = function(object, property, value) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    if (object[property] !== value)
        dop.core.set(object, property, value);
    return value;
};