
dop.core.swap = function(array, swaps) {

//     if (swaps.length>1) {

//         var objectTarget = dop.getObjectTarget(array),
//             objectProxy = dop.getObjectProxy(array);

// console.log('AAAAA')
// console.log(' ')
// console.log(' ')
// console.log(' ')
// console.log(' ')
//         // var result = dop.util.swap(objectTarget, swaps, function(swapA, swapB){
//         //     // Updating path
//         //     // dop.core.updatePathArray(objectTarget, swapA);
//         //     // dop.core.updatePathArray(objectTarget, swapB);
//         // })

//         if (objectTarget===objectProxy || array===objectProxy)
//             dop.core.storeMutation({
//                 object:objectProxy,
//                 swaps:swaps
//             });

//         return result;
//     }
};



dop.util.swap = function(array, swaps, callback) {

    if (array.length>0 && swaps.length>1) {

        var index = 0,
            total = swaps.length-1,
            tempItem, swapA, swapB,
            isCallback = isFunction(callback);

        for (;index<total; index+=2) {
            swapA = swaps[index];
            swapB = swaps[index+1];
            tempItem = array[swapA];
            array[swapA] = array[swapB];
            array[swapB] = tempItem;
            if (isCallback)
                callback(swapA, swapB);
        }
    }

     return array;
};