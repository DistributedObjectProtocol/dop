dop.encode = function(data, encoder) {
    if (typeof encoder != 'function') encoder = dop.core.encode
    return JSON.stringify(data, encoder)
}
dop.encodeFunction = function(data) {
    return JSON.stringify(data, dop.core.encodeFunction)
}
