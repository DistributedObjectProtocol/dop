
dop.core.delete = function(target, property) {
    var descriptor = Object.getOwnPropertyDescriptor(target, property);
    if (descriptor && descriptor.configurable) {
        target = dop.getObjectTarget(target);
        var mutation = {
            object:dop.getObjectProxy(target),
            name:property,
            oldValue:target[property]
        };
        delete target[property];
        dop.core.storeMutation(mutation);
        return mutation;
    }
};