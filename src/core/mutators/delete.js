
dop.core.delete = function(object, property) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);
    if (descriptor && descriptor.configurable) {
        
        var objectTarget = dop.getObjectTarget(object),
            objectProxy = dop.getObjectProxy(object);

        if (objectTarget===objectProxy || object===objectProxy) {
            var mutation = {
                object:dop.getObjectProxy(objectTarget),
                name:property,
                oldValue:dop.copy(objectTarget[property])
            };
            dop.core.storeMutation(mutation);
        }

        return delete objectTarget[property];
    }
};