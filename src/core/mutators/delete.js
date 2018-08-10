dop.core.delete = function(object, property) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property)
    if (descriptor && descriptor.configurable) {
        var object_target = dop.getObjectTarget(object),
            object_proxy = dop.getObjectProxy(object),
            path,
            old_value = object_target[property],
            deleted = delete object_target[property]

        if (
            (object_target === object_proxy || object === object_proxy) &&
            (path = dop.getObjectPath(object))
        )
            dop.core.storeMutation({
                object: dop.getObjectProxy(object_target),
                prop: String(property),
                path: path,
                old_value: dop.util.clone(old_value)
            })

        // needed for dop.core.proxyObjectHandler.deleteProperty
        return deleted
    }
}
