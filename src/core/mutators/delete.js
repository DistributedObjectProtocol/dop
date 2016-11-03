
dop.core.delete = function(object, property) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);
    if (descriptor && descriptor.configurable) {
        
        var target = dop.getObjectTarget(object);
        delete target[property];

        if (object !== target) {
            var mutation = {
                object:dop.getObjectProxy(target),
                name:property,
                oldValue:target[property]
            };
            dop.core.storeMutation(mutation);
            return mutation;
        }
    }
};