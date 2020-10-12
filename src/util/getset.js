import { is, isPlain, isObject } from './is'
import merge from './merge'

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
    if (isObject(object)) {
        path = path.slice(0)
        const prop = path.shift()
        return path.length > 0 ? getDeep(object[prop], path) : object[prop]
    }
}

export function setDeep(object, path, value) {
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

export function createPatchFromMutations(mutations, patch_original) {
    const patch = {}
    const unpatch = {}
    mutations.forEach(({ path, old_value }) => {
        setDeep(patch, path.slice(0), getDeep(patch_original, path))
        setDeep(unpatch, path.slice(0), old_value)
    })
    return { patch, unpatch }
}
