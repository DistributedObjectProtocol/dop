import { isArray, isPlainObject } from '../util/is'
import merge from '../util/merge'
import Delete from './Delete'

export default function Plain() {}

Plain.patch = function ({ patch, target, prop, old_value, applyPatch }) {
    const patch_value = patch[prop]
    if (isPlainObject(patch_value)) {
        // if (isArray(old_value)) {
        // console.log({ patch, target, prop, old_value })
        // target[prop] = applyPatch([], patch_value).result
        // } else {
        target[prop] = applyPatch({}, patch_value).result
        // }
    }

    // New array
    else if (isArray(patch_value)) {
        target[prop] = merge([], patch_value)
    }

    return old_value
}
