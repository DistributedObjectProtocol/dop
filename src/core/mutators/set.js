
dop.core.set = function(object, property, value, options) {

    if (!isObject(options))
        options = {}

    options.deep = typeof options.deep == 'boolean' ? options.deep : true
    options.shadow = typeof options.shadow == 'boolean' ? options.shadow : false

    // If is a different value
    if (object[property] !== value) {

        var descriptor = Object.getOwnPropertyDescriptor(object, property);

        if (!descriptor || (descriptor && descriptor.writable)) {
            var objectTarget = dop.getObjectTarget(object),
                objectProxy = dop.getObjectProxy(object),
                oldValue = objectTarget[property],
                length = objectTarget.length,
                isNewProperty = !objectTarget.hasOwnProperty(property),
                objectIsArray = isArray(objectTarget),
                path;
            
            // if (objectIsArray)
            //     property = Number(property);

            // object or array
            if (options.deep && dop.isObjectRegistrable(value) && !(dop.isRegistered(value) && dop.getObjectParent(value) === objectProxy))
                objectTarget[property] = dop.core.configureObject(value, property, objectProxy);
            // computed value
            else if (isFunction(value) && value._name==dop.cons.COMPUTED_FUNCTION)
                objectTarget[property] = value(objectTarget, property, false, oldValue);
            // other
            else
                objectTarget[property] = value;

            if (
                !options.shadow &&
                (objectTarget===objectProxy || object===objectProxy) &&
                !(isFunction(oldValue) && isFunction(value)) &&
                (path = dop.getObjectPath(object))
            ) {
                var mutation = {
                    object: objectProxy,
                    prop: objectIsArray ? String(property) : property,
                    path: path,
                    value: dop.util.clone(value)
                };
                if (!isNewProperty)
                    mutation.oldValue = dop.util.clone(oldValue)

                dop.core.storeMutation(mutation);

                // If is array and length is different we must store the length 
                if (property !== 'length' && objectTarget.length !== length && objectIsArray)
                    dop.core.storeMutation({
                        object: objectProxy,
                        prop: 'length',
                        path: path,
                        value: objectTarget.length,
                        oldValue: length
                    });
            }
        }
    }
};