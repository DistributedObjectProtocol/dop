import { isArray, isPlainObject } from '../util/is'
import merge from '../util/merge'

export default function Object() {}

Object.patch = function ({ patch, target, prop, old_value, applyPatch }) {
    const patch_value = patch[prop]
    if (isPlainObject(patch_value)) {
        console.log('entra???')
        target[prop] = applyPatch({}, patch_value).result
    }

    return old_value
}
