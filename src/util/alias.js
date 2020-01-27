// Private alias
function isFunction(func) {
    return typeof func == 'function'
}

function isObject(object) {
    return object !== null && typeof object == 'object'
}

function isArray(array) {
    return Array.isArray(array)
}

function isNumber(number) {
    return typeof number == 'number'
}

function isEmptyObject(object) {
    for (var key in object) return false
    return true
}
