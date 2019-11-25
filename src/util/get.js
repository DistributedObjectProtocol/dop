import { is, isPlain } from './is'
import merge from './merge'

export function getUniqueKey(object, objectList) {
    let key_name
    for (const key in object) {
        if (!objectList.hasOwnProperty(key) || key_name !== undefined) {
            return
        }
        key_name = key
    }
    return key_name
}

export function getNewPlain(value) {
    return isPlain(value) ? merge(is(value) == 'array' ? [] : {}, value) : value
}
