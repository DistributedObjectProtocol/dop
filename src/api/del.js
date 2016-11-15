
dop.del = function(object, property) {
    // dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.del must be a registered object');
    if (dop.isRegistered(object))
        return dop.core.delete(object, property) !== undefined;
    else
        return delete object[property];
};