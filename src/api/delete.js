
dop.delete = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.delete must be a registered object');
    var mutation = dop.core.mutate(object, property);
    if (mutation !== false) {
        var object_id = dop.getObjectId(object);
        dop.core.storeMutation(mutation);
        dop.core.emitMutations();
    }
    return true;
};