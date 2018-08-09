// https://jsperf.com/array-reverse-algorithm
dop.core.reverse = function(array) {
    var objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        path

    if (
        (objectTarget === objectProxy || array === objectProxy) &&
        (path = dop.getObjectPath(array))
    ) {
        var total = objectTarget.length / 2,
            index = 0,
            indexr,
            tempItem,
            swaps = []

        for (; index < total; ++index) {
            indexr = objectTarget.length - index - 1
            if (index !== indexr) {
                tempItem = objectTarget[indexr]
                objectTarget[indexr] = objectTarget[index]
                objectTarget[index] = tempItem
                swaps.push(index, indexr)
            }
        }

        if (swaps.length > 0)
            dop.core.storeMutation({
                object: objectProxy,
                prop: dop.getObjectProperty(array),
                path: path,
                swaps: swaps
            })
    } else Array.prototype.reverse.call(objectTarget)

    return array
}
