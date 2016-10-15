
dop.del = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.delete must be a registered object');
    if (object.hasOwnProperty(property)) {
        dop.core.storeMutation(dop.core.delete(object, property));
        return true;
    }
    return false;
};