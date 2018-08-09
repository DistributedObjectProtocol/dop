dop.core.shift = function(array) {
    if (array.length === 0) return undefined
    var spliced = dop.core.splice(array, [0, 1])
    return spliced[0]
}
