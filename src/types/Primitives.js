import { isArray, isPlainObject } from '../util/is'
import { merge } from '../util/merge'
import Replace from './Replace'
import Delete from './Delete'

export default function Primitives() {}

Primitives.patch = function ({ patch, target, prop, old_value, applyPatch }) {
    const patch_value = patch[prop]

    // If target[prop] is not defined yet
    if (!target.hasOwnProperty(prop)) {
        old_value = new Delete()
    }

    // New array
    if (isArray(patch_value)) {
        target[prop] = merge([], patch_value)
        if (isPlainObject(old_value)) {
            old_value = Replace(old_value)
        }
    }

    // Object as patch
    else if (isPlainObject(patch_value)) {
        target[prop] = applyPatch({}, patch_value).result
    }

    // Any other
    else {
        target[prop] = patch_value
    }

    return old_value
}
