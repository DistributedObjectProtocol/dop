
dop.get = function(object, property) {
    // dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.del must be a registered object');
    if (dop.data.gets_collecting && dop.isRegistered(object))
        dop.core.proxyObjectHandler.get(dop.getObjectTarget(object), property);

    return object[property];
};