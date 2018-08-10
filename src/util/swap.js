dop.util.swap = function(array, swaps, callback) {
    if (array.length > 0 && swaps.length > 1) {
        var index = 0,
            total = swaps.length - 1,
            temp_item,
            swapA,
            swapB,
            is_callback = isFunction(callback)

        for (; index < total; index += 2) {
            swapA = swaps[index]
            swapB = swaps[index + 1]
            temp_item = array[swapA]
            array[swapA] = array[swapB]
            array[swapB] = temp_item
            if (is_callback) callback(swapA, swapB)
        }
    }

    return array
}
