// https://jsperf.com/array-reverse-algorithm
dop.core.reverse = function(array) {
    var object_target = dop.getObjectTarget(array),
        object_proxy = dop.getObjectProxy(array),
        path

    if (
        (object_target === object_proxy || array === object_proxy) &&
        (path = dop.getObjectPath(array))
    ) {
        var total = object_target.length / 2,
            index = 0,
            indexr,
            temp_item,
            swaps = []

        for (; index < total; ++index) {
            indexr = object_target.length - index - 1
            if (index !== indexr) {
                temp_item = object_target[indexr]
                object_target[indexr] = object_target[index]
                object_target[index] = temp_item
                swaps.push(index, indexr)
            }
        }

        if (swaps.length > 0)
            dop.core.storeMutation({
                object: object_proxy,
                prop: dop.getObjectProperty(array),
                path: path,
                swaps: swaps
            })
    } else Array.prototype.reverse.call(object_target)

    return array
}
