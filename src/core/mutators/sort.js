// http://stackoverflow.com/a/234777/1469219 http://stackoverflow.com/a/38905402/1469219
// https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
// http://khan4019.github.io/front-end-Interview-Questions/sort.html#bubbleSort
// https://github.com/benoitvallon/computer-science-in-javascript/tree/master/sorting-algorithms-in-javascript
dop.core.sort = function(array, compareFunction) {
    var object_target = dop.getObjectTarget(array),
        object_proxy = dop.getObjectProxy(array),
        copy = object_target.slice(0),
        output,
        swaps,
        path

    output = Array.prototype.sort.call(object_target, compareFunction)

    if (
        (object_target === object_proxy || array === object_proxy) &&
        (path = dop.getObjectPath(array))
    ) {
        swaps = dop.core.sortDiff(object_target, copy)
        if (swaps.length > 1)
            dop.core.storeMutation({
                object: dop.getObjectProxy(array),
                prop: dop.getObjectProperty(array),
                path: path,
                swaps: swaps
            })
    }

    return output
}

dop.core.sortDiff = function(array, copy) {
    var total = copy.length,
        swaps = [],
        index1 = 0,
        index2,
        tmp

    for (; index1 < total; ++index1) {
        if (array[index1] !== copy[index1]) {
            index2 = copy.indexOf(array[index1])
            tmp = copy[index1]
            copy[index1] = copy[index2]
            copy[index2] = tmp
            swaps.push(index1, index2)
        }
    }

    return swaps
}

// function diffArray(array) {
//     var copy = array.slice(0),
//         swaps = [],
//         index = 0,
//         total = copy.length,
//         indexNew, tmp;

//     array.sort();

//     for (;index<total; ++index) {
//         if (copy[index] !== array[index]) {
//             indexNew = copy.indexOf(array[index]);
//             tmp = copy[index];
//             copy[index] = copy[indexNew];
//             copy[indexNew] = tmp;
//             swaps.push([index, indexNew]);

//             console.log([index, indexNew], copy );
//             if (indexNew < index) {
//                 console.log( 'lol' );
//             }

//             // swapeds[indexNew] = true;
//             // if (indexCache!==indexNew && indexCache !== index) {
//             //     swapeds[indexCache] = true;
//             //     swap(copy, indexNew, indexCache);
//             //     swaps.push([indexNew, indexCache]);
//             //     console.log([indexNew, indexCache], copy, swapeds );
//             // }
//         }
//     }

//     return swaps;
// }
