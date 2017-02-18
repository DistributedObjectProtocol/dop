
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

            if ((objectTarget===objectProxy || object===objectProxy) && !(isFunction(oldValue) && isFunction(value))) {
                var mutation = {
                    object: objectProxy,
                    name: property,
                    value: isArray(value) ? value.slice(0) : value
                };
                if (hasOwnProperty)
                    mutation.oldValue = oldValue;
                // We cant store the original array cuz when we inject the mutation into the patch object could be different from the original
                //if (isArray(value))
                //    mutation.valueOriginal = value.slice(0); //dop.util.merge([], value);

                dop.core.storeMutation(mutation);

                // if is array we must store the length in order to revert it with setUnpatch
                if (isArray(objectTarget) && objectTarget.length !== length)
                    dop.core.storeMutation({
                        object:objectProxy,
                        name:'length',
                        value:objectTarget.length,
                        oldValue:length
                    });

                return mutation;
            }
        }
    }
};