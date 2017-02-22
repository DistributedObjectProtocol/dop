// https://jsperf.com/array-reverse-algorithm
dop.core.reverse = function(array) {
    var objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        total = objectTarget.length/2,
        index = 0,
        indexr,
        tempItem,
        swaps = [],
        shallWeStore = (objectTarget===objectProxy || array===objectProxy);

    for (;index<total; ++index) {
        indexr = objectTarget.length-index-1;
        if (index !== indexr) {
            tempItem = objectTarget[indexr];
            objectTarget[indexr] = objectTarget[index];
            objectTarget[index] = tempItem;
            if (shallWeStore)
                swaps.push(index, indexr);

            // Updating path
            dop.core.updatePathArray(objectTarget, index);
            dop.core.updatePathArray(objectTarget, indexr);
        }
    }

    if (shallWeStore && swaps.length>0)
        dop.core.storeMutation({
            object:objectProxy,
            swaps:swaps
        });

    return array;
};