export function is(value) {
    if (value === null) return 'null'
    if (isArray(value)) return 'array'
    return typeof value
}

export function isFunction(func) {
    return typeof func == 'function'
}

export function isObject(object) {
    return object !== null && typeof object == 'object'
}

export function isArray(array) {
    return Array.isArray(array)
}

export function isNumber(number) {
    return typeof number == 'number'
}
