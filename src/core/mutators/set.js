
dop.core.set = function(target, property, value) {

    var descriptor = Object.getOwnPropertyDescriptor(target, property);

    if (!descriptor || (descriptor && descriptor.writable)) {
        target = dop.getObjectTarget(target);
        var proxy = dop.getObjectProxy(target),
            oldValue = target[property],
            hasOwnProperty = target.hasOwnProperty(property);

        // Setting
        target[property] = value;
        if (dop.util.isObjectStandard(value)) {
            // var object_dop = dop.getObjectDop(value);
            // if (dop.isRegistered(value) && Array.isArray(object_dop._) && object_dop._ === dop.getObjectProxy(target))
            //     object_dop[object_dop.length-1] = property;
            // else {
                var shallWeProxy = dop.data.object_data[dop.getObjectId(target)].options.proxy;
                target[property] = dop.core.configureObject(value, dop.getObjectDop(target).concat(property), shallWeProxy, proxy);
            // }
        }

        var mutation = {object:proxy, name:property, value:value};
        if (hasOwnProperty)
            mutation.oldValue = oldValue;

        dop.core.storeMutation(mutation);

        return mutation;

    }

};