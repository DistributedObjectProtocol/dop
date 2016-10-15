
dop.core.delete = function(target, property) {
    target = dop.getObjectTarget(target);
    var mutation = {
        object:dop.getObjectProxy(target),
        name:property,
        oldValue:target[property]
    };
    delete target[property];
    return mutation;
};