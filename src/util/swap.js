dop.util.swap = function(array, swaps, callback) {
    if (array.length > 0 && swaps.length > 1) {
        var index = 0,
            total = swaps.length - 1,
            tempItem,
            swapA,
            swapB,
            isCallback = isFunction(callback)

        for (; index < total; index += 2) {
            swapA = swaps[index]
            swapB = swaps[index + 1]
            tempItem = array[swapA]
            array[swapA] = array[swapB]
            array[swapB] = tempItem
            if (isCallback) callback(swapA, swapB)
        }
    }

    return array
}
