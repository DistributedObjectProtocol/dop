import { getUniqueKey } from '../util/getset.js'
import { ESCAPE_KEY } from '../const.js'

export function is(value) {
    if (value === null) return 'null'
    if (isArray(value)) return 'array'
    return typeof value
}

export function isFunction(fn) {
    return typeof fn == 'function'
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

// export function isProxy(object) {
//     if (typeof Proxy !== 'function') {
//         return false
//     }
//     try {
//         object instanceof Proxy
//         return false
//     } catch (e) {
//         return true
//     }
// }

export function isValidToDecode({ value, key }) {
    return getUniqueKey(value) === key && value.hasOwnProperty(key)
}

export function isValidToEscape({ value }) {
    return getUniqueKey(value) === ESCAPE_KEY
}
