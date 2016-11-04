
dop.core.delete = function(object, property) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);
    if (descriptor && descriptor.configurable) {
        
        var objectTarget = dop.getObjectTarget(object);
        delete objectTarget[property];

        if (object !== objectTarget) {
            var mutation = {
                object:dop.getObjectProxy(objectTarget),
                name:property,
                oldValue:objectTarget[property]
            };
            dop.core.storeMutation(mutation);
            return mutation;
        }
    }
};