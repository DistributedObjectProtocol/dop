import { isArray } from '../util/is'
import merge from '../util/merge'

export default function Array() {}

Array.patch = function({ patch, target, prop, old_value }) {
    const patch_value = patch[prop]
    if (isArray(patch_value)) {
        target[prop] = merge([], patch_value)
    }
    return old_value
}
