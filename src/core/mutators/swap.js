
dop.core.swap = function(array, swaps) {

    if (swaps.length>1) {

        var objectTarget = dop.getObjectTarget(array),
            objectProxy = dop.getObjectProxy(array),
            index = 0,
            total = array.length-1,
            tempItem, swapA, swapB;

        for (;index<total; index+=2) {
            swapA = swaps[index];
            swapB = swaps[index+1];
            tempItem = objectTarget[swapA];
            objectTarget[swapA] = objectTarget[swapB];
            objectTarget[swapB] = tempItem;
            // Updating path
            dop.core.updatePathArray(objectTarget, swapA);
            dop.core.updatePathArray(objectTarget, swapB);
        }


        if (objectTarget===objectProxy || array===objectProxy)
            dop.core.storeMutation({
                object:objectProxy,
                swaps:swaps
            });

        return array;
    }

};