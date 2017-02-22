
dop.core.swap = function(array, swaps) {

    if (swaps.length>1) {

        var objectTarget = dop.getObjectTarget(array),
            objectProxy = dop.getObjectProxy(array);

        var result = dop.util.swap(objectTarget, swaps, function(swapA, swapB){
            // Updating path
            dop.core.updatePathArray(objectTarget, swapA);
            dop.core.updatePathArray(objectTarget, swapB);
        })

        if (objectTarget===objectProxy || array===objectProxy)
            dop.core.storeMutation({
                object:objectProxy,
                swaps:swaps
            });

        return result;
    }
};