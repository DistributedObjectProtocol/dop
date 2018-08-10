dop.core.swap = function(array, swaps) {
    var object_target = dop.getObjectTarget(array),
        object_proxy = dop.getObjectProxy(array)

    var result = dop.util.swap(object_target, swaps)

    if (object_target === object_proxy || array === object_proxy)
        dop.core.storeMutation({
            object: object_proxy,
            prop: dop.getObjectProperty(array),
            path: dop.getObjectPath(array),
            swaps: swaps.slice(0)
        })

    return result
}
