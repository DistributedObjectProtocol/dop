
dop.core.set = function(object, property, value) {

    if (object[property] !== value) {

        var descriptor = Object.getOwnPropertyDescriptor(object, property);

        if (!descriptor || (descriptor && descriptor.writable)) {
            var objectTarget = dop.getObjectTarget(object),
                objectProxy = dop.getObjectProxy(object),
                oldValue = objectTarget[property],
                length = objectTarget.length,
                hasOwnProperty = objectTarget.hasOwnProperty(property);

            // Setting
            objectTarget[property] = value;
            if (dop.isObjectRegistrable(value)) {
                // var object_dop = dop.getObjectDop(value);
                // if (dop.isRegistered(value) && isArray(object_dop._) && object_dop._ === objectTarget)
                //     object_dop[object_dop.length-1] = property;
                // else {
                    // var shallWeProxy = dop.data.object_data[dop.getObjectId(objectTarget)].options.proxy;
                    objectTarget[property] = dop.core.configureObject(value, dop.getObjectDop(objectTarget).concat(property), objectTarget);
                // }
            }

            if ((objectTarget===objectProxy || object===objectProxy) && !(isFunction(object[property]) && isFunction(value))) {
                var mutation = {object:objectProxy, name:property, value:value};
                if (hasOwnProperty)
                    mutation.oldValue = oldValue;
                if (isArray(objectTarget)) // if is array we must store the length in order to revert it with setUnaction
                    mutation.length = length;
                if (isArray(value)) // We cant store the original array cuz when we inject the mutation into the action object could be different from the original
                    mutation.valueOriginal = dop.util.merge([], value);

                dop.core.storeMutation(mutation);

                return mutation;
            }
        }
    }
};