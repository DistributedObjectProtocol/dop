
dop.core.set = function(object, property, value) {

    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (!descriptor || (descriptor && descriptor.writable)) {
        var target = dop.getObjectTarget(object),
            proxy = dop.getObjectProxy(object),
            oldValue = target[property],
            hasOwnProperty = target.hasOwnProperty(property);

        // Setting
        target[property] = value;
        if (dop.util.isObjectPlain(value)) {
            // var object_dop = dop.getObjectDop(value);
            // if (dop.isRegistered(value) && Array.isArray(object_dop._) && object_dop._ === target)
            //     object_dop[object_dop.length-1] = property;
            // else {
                var shallWeProxy = dop.data.object_data[dop.getObjectId(target)].options.proxy;
                target[property] = dop.core.configureObject(value, dop.getObjectDop(target).concat(property), shallWeProxy, target);
            // }
        }

        if (object === proxy) {
            var mutation = {object:proxy, name:property, value:value};
            if (hasOwnProperty)
                mutation.oldValue = oldValue;

            dop.core.storeMutation(mutation);

            return mutation;
        }
    }

};