// https://jsperf.com/push-against-splice OR https://jsperf.com/push-vs-splice
dop.core.push = function(array, items) {
    if (items.length === 0) return array.length
    items.unshift(array.length, 0)
    dop.core.splice(array, items)
    return array.length
}
