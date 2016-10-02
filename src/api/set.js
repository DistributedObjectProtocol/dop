
dop.set = function(object, property, value) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    var mutation = dop.core.mutate(object, property, value);
    if (mutation !== false)
        dop.core.storeMutation(mutation);
    return true;
};