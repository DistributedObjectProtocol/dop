
dop.delete = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.delete must be a registered object');
    var mutation = dop.core.mutate(object, property);
    if (mutation !== false)
        dop.core.storeMutation(mutation);
    return true;
};