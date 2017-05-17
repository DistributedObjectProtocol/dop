
dop.core.set = function(object, property, value) {

    // If is a different value
    if (object[property] !== value) {

        var descriptor = Object.getOwnPropertyDescriptor(object, property);

        if (!descriptor || (descriptor && descriptor.writable)) {
            var objectTarget = dop.getObjectTarget(object),
                objectProxy = dop.getObjectProxy(object),
                oldValue = objectTarget[property],
                length = objectTarget.length,
                isNewProperty = !objectTarget.hasOwnProperty(property),
                path;

            // Setting
            objectTarget[property] = dop.isObjectRegistrable(value) ?
                dop.core.configureObject(value, property, objectTarget)
            :
                value;

            if (
                (objectTarget===objectProxy || object===objectProxy) &&
                !(isFunction(oldValue) && isFunction(value)) &&
                (path = dop.getObjectPath(object))
            ) {
                var mutation = {
                    object: objectProxy,
                    prop: property,
                    path: path,
                    value: dop.util.clone(value)
                };
                if (!isNewProperty)
                    mutation.oldValue = dop.util.clone(oldValue)

                // If is array and length is different we must store the length 
                if (objectTarget.length !== length && isArray(objectTarget))
                    dop.core.storeMutation({
                        object: objectProxy,
                        prop: 'length',
                        path: path,
                        value: objectTarget.length,
                        oldValue: length
                    });

                dop.core.storeMutation(mutation);
            }
        }
    }
};