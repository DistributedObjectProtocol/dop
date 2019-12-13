import { NAME_REMOTE_FUNCTION } from '../const'

export function is(value) {
    if (value === null) return 'null'
    if (isArray(value)) return 'array'
    return typeof value
}

export function isFunction(f) {
    return typeof f == 'function'
}

export function isArray(array) {
    return Array.isArray(array)
}

export function isObject(object) {
    return object !== null && typeof object == 'object'
}

export function isPlain(object) {
    if (!isObject(object)) return false
    const prototype = Object.getPrototypeOf(object)
    return prototype === Object.prototype || prototype === Array.prototype
}

export function isPlainObject(object) {
    if (!isObject(object)) return false
    return Object.getPrototypeOf(object) === Object.prototype
}

export function isInteger(number) {
    return (
        typeof number === 'number' &&
        isFinite(number) &&
        Math.floor(number) === number
    )
}

export function isString(string) {
    return typeof string === 'string'
}

export function isRemoteFunction(f) {
    return isFunction(f) && f.name === NAME_REMOTE_FUNCTION
}

// function Test() {}
// console.log(isPlain({}))
// console.log(isPlain([]))
// console.log(isPlain(new Test()))
// console.log(isPlain(new Error()))
// console.log(isPlain(new Date()))
// console.log(isPlain(null))
// console.log(isPlain(Symbol('')))
// console.log(isPlain(function() {}))
// console.log(isPlain(1))
// console.log(isPlain('s'))
// console.log(isPlain(true))
// console.log(isPlain(/a/))
