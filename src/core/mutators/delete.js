
dop.core.delete = function(object, property) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);
    if (descriptor && descriptor.configurable) {
        
        var objectTarget = dop.getObjectTarget(object),
            objectProxy = dop.getObjectProxy(object),
            path,
            oldValue = objectTarget[property],
            deleted = delete objectTarget[property];

        if ((objectTarget===objectProxy || object===objectProxy) && (path = dop.getObjectPath(object)))
            dop.core.storeMutation({
                object: dop.getObjectProxy(objectTarget),
                prop: property,
                path: path,
                oldValue: dop.util.clone(oldValue)
            });

        // needed for dop.core.proxyObjectHandler.deleteProperty
        return deleted;
    }
};