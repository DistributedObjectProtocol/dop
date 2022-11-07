import { is, isPlain, isObject } from './is.js'
import { merge } from './merge.js'

export function getUniqueKey(object) {
    let key_name
    for (const key in object) {
        if (key_name !== undefined) {
            return
        }
        key_name = key
    }
    return key_name
}

export function getNewPlain(value) {
    return isPlain(value) ? merge(is(value) == 'array' ? [] : {}, value) : value
}

export function getDeep(object, path) {
    const [prop] = path
    if (path.length === 0) return object
    if (isObject(object) && object.hasOwnProperty(prop)) {
        return getDeep(object[prop], path.slice(1))
    }
}

export function setDeep(object, path, value) {
    path = path.slice(0)
    const prop = path.shift()
    if (path.length === 0) {
        object[prop] = value
        return
    }
    if (!object.hasOwnProperty(prop)) {
        object[prop] = {}
    }
    return setDeep(object[prop], path, value)
}
