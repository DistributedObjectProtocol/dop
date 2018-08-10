dop.core.set = function(object, property, value, options) {
    if (!isObject(options)) options = {}

    options.deep = typeof options.deep == 'boolean' ? options.deep : true
    options.shadow = typeof options.shadow == 'boolean' ? options.shadow : false

    // If is a different value
    if (object[property] !== value || !object.hasOwnProperty(property)) {
        var descriptor = Object.getOwnPropertyDescriptor(object, property)

        if (!descriptor || (descriptor && descriptor.writable)) {
            var object_target = dop.getObjectTarget(object),
                object_proxy = dop.getObjectProxy(object),
                old_value = object_target[property],
                length = object_target.length,
                is_new_property = !object_target.hasOwnProperty(property),
                object_is_array = isArray(object_target),
                path

            // if (object_is_array)
            //     property = Number(property);

            // object or array
            if (
                options.deep &&
                dop.isPojoObject(value) &&
                !(
                    dop.isRegistered(value) &&
                    dop.getObjectParent(value) === object_proxy
                )
            )
                object_target[property] = dop.core.configureObject(
                    value,
                    property,
                    object_proxy
                )
            // computed value
            else if (
                isFunction(value) &&
                value._name == dop.cons.COMPUTED_FUNCTION
            )
                object_target[property] = value(
                    object_target,
                    property,
                    false,
                    old_value
                )
            // other
            else object_target[property] = value

            if (
                !options.shadow &&
                (object_target === object_proxy || object === object_proxy) &&
                !(isFunction(old_value) && isFunction(value)) &&
                (path = dop.getObjectPath(object))
            ) {
                var mutation = {
                    object: object_proxy,
                    prop: object_is_array ? String(property) : property,
                    path: path,
                    value: dop.util.clone(value)
                }
                if (!is_new_property)
                    mutation.old_value = dop.util.clone(old_value)

                dop.core.storeMutation(mutation)

                // If is array and length is different we must store the length
                if (
                    property !== 'length' &&
                    object_target.length !== length &&
                    object_is_array
                )
                    dop.core.storeMutation({
                        object: object_proxy,
                        prop: 'length',
                        path: path,
                        value: object_target.length,
                        old_value: length
                    })
            }
        }
    }
}
