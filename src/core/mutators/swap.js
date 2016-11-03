
dop.core.swap = function(swaps) {

    var array = this,
        objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        index = 0,
        total = array.length,
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


    // if (swaps.length>1 && (objectTarget===objectProxy || array===objectProxy))
    //     dop.core.storeMutation({
    //         object:dop.getObjectDop(objectProxy)._,
    //         name:dop.getObjectProperty(objectProxy),
    //         swaps:swaps
    //     });

    return array;
};