import { isArray, isPlainObject } from '../util/is'
import merge from '../util/merge'
import Replace from './Replace'
import Delete from './Delete'

export default function Primitives() {}

Primitives.patch = function ({
    patch,
    target,
    prop,
    old_value,
    had_prop,
    applyPatch,
}) {
    const patch_value = patch[prop]

    if (!had_prop) {
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
        // Mutating array internaly
        if (isArray(old_value)) {
            const unpatches = {}
            const length = old_value.length
            for (const key in patch_value) {
                const had_prop = old_value.hasOwnProperty(key)
                const patched = applyPatch(old_value[key], patch_value[key])
                if (
                    old_value[key] !== patched.result ||
                    isPlainObject(patch_value[key])
                ) {
                    old_value[key] = patched.result
                    unpatches[key] = had_prop ? patched.unpatch : Delete()
                }
            }
            if (old_value.length !== length) {
                unpatches.length = length
            }

            return unpatches
        }

        // New object
        else {
            target[prop] = applyPatch({}, patch_value).result
        }
    }

    // Any other
    else {
        target[prop] = patch_value
    }

    return old_value
}
