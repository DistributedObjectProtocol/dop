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













// dop.core.swap = function() {
//     var items = Array.prototype.slice.call(arguments, 0),
//         array = this,
//         objectTarget = dop.getObjectTarget(array),
//         objectProxy = dop.getObjectProxy(array),
//         swaps = [],
//         shallWeStore = (objectTarget===objectProxy || array===objectProxy),
//         index=0, length=items.length, one, two, tempItem;

//     for (;index<length; index+=2) {
//         one = Number(items[index]);
//         two = Number(items[index+1]);
//         if (!isNaN(two) && one!==two) {
//             // if (objectTarget===objectProxy || array===objectProxy) {}
//             tempItem = objectTarget[two];
//             objectTarget[two] = objectTarget[one];
//             objectTarget[one] = tempItem;
//             swaps.push(one,two);
//         }
//     }

//     if (shallWeStore && swaps.length>0)
//         dop.core.storeMutation({
//             object:objectProxy,
//             swaps:swaps
//         });

//     return swaps;
// };


// var arr = ['Hola', 'Mundo', 'Cruel', 'Te', 'Odio', 'Mucho'];
// swap.call(arr, 2,1,3,'5','1','0');
// console.log( arr );

// swap.call(arr, '0','1','5',3,1,2);
// console.log( arr );
