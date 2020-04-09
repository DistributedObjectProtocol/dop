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
    path,
    had_prop,
    unpatch_root,
    applyPatch,
    registerMutation,
}) {
    const patch_value = patch[prop]

    if (!had_prop) {
        if (isArray(target)) {
            const path_length = path.slice(0, path.length - 1).concat('length')
            // console.log(
            //     path_length.join('.'),
            //     unpatch_root,
            //     getDeep(unpatch_root, path_length.slice(0))
            // )
            if (!getDeep(unpatch_root, path_length.slice(0))) {
                registerMutation(path_length, target, 'length', target.length)
            }
        } else {
            old_value = new Delete()
        }
    }

    if (isPlainObject(patch_value)) {
        // console.log({ path, had_prop, target })
        target[prop] = applyPatch({}, patch_value).result
    }

    // New array
    else if (isArray(patch_value)) {
        target[prop] = merge([], patch_value)
        return isPlainObject(old_value) ? Replace(old_value) : old_value
    }

    // Any other
    else {
        target[prop] = patch_value
    }

    return old_value
}

function getDeep(object, path) {
    if (path.length === 0) {
        return true
    }
    const prop = path.shift()
    return object.hasOwnProperty(prop) ? getDeep(object[prop], path) : false
}
