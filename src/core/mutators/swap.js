
dop.core.swap = function(array, swaps) {
    var objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array);

    var result = dop.util.swap(objectTarget, swaps);

    if (objectTarget===objectProxy || array===objectProxy)
        dop.core.storeMutation({
            object: objectProxy,
            prop: dop.getObjectProperty(array),
            path: dop.getObjectPath(array),
            swaps: swaps.slice(0)
        });

    return result;
};