import { ESCAPE_KEY, INNER_KEY } from '../const'
import { isValidToEscape } from '../util/isValid'
import { isArray, isPlainObject } from '../util/is'
import { getUniqueKey } from '../util/get'
import Delete from './Delete'

export default function Inner(patch) {
    if (!isPlainObject(patch))
        throw 'TYPE.Inner only accepts plain objects as argument'
    if (!(this instanceof Inner)) {
        return new Inner(patch)
    }
    this.patch = patch
}

Inner.patch = function({ patch, target, prop, old_value, applyPatch }) {
    const patch_value = patch[prop]
    if (patch_value instanceof Inner) {
        target[prop] = old_value
        if (isArray(old_value)) {
            const patches = patch_value.patch
            const unpatches = {}
            const length = old_value.length
            for (const key in patches) {
                const had_prop = old_value.hasOwnProperty(key)
                const patched = applyPatch(old_value[key], patches[key])
                if (
                    old_value[key] !== patched.result ||
                    isPlainObject(patches[key])
                ) {
                    old_value[key] = patched.result
                    unpatches[key] = had_prop ? patched.unpatch : Delete()
                }
            }
            if (old_value.length !== length) {
                unpatches.length = length
            }
            // console.log({ result: old_value, unpatches })
            return new Inner(unpatches)
        }
    }
    return old_value
}

Inner.encode = function({ value, encode }) {
    if (value instanceof Inner) {
        return { [INNER_KEY]: encode(value.patch) }
    } else if (isValidToDecodeInner({ value })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Inner.decode = function({ value, decode }) {
    if (isValidToDecodeInner({ value })) {
        return new Inner(decode(value[INNER_KEY]))
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecodeInner({ value: value[ESCAPE_KEY] })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}

function isValidToDecodeInner({ value }) {
    return getUniqueKey(value) === INNER_KEY && isPlainObject(value[INNER_KEY])
}
