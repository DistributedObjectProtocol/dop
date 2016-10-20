
dop.del = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.del must be a registered object');
    return dop.core.delete(object, property) !== undefined;
};