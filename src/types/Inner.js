import { ESCAPE_KEY, INNER_KEY } from '../const'
import { isValidToEscape } from '../util/isValid'
import { isArray, isPlainObject } from '../util/is'
import { getUniqueKey } from '../util/get'

export default function Inner(patch) {
    if (!isPlainObject(patch))
        throw 'TYPE.Inner only accepts plain objects as argument'
    if (!(this instanceof Inner)) {
        return new Inner(patch)
    }
    this.patch = patch
}

Inner.patch = function({ origin, destiny, prop, oldValue, applyPatch }) {
    const origin_value = origin[prop]
    if (origin_value instanceof Inner) {
        destiny[prop] = oldValue
        if (isArray(oldValue)) {
            const patches = origin_value.patch
            const unpatches = {}
            const length = oldValue.length
            for (const key in patches) {
                const patched = applyPatch(oldValue[key], patches[key])
                if (
                    oldValue[key] !== patched.result ||
                    isPlainObject(patches[key])
                ) {
                    oldValue[key] = patched.result
                    unpatches[key] = patched.unpatch
                }
            }
            if (oldValue.length !== length) {
                unpatches.length = length
            }
            // console.log({ result: oldValue, unpatches })
            return new Inner(unpatches)
        }
    }
    return oldValue
}

Inner.encode = function({ value, ...args }) {
    if (value instanceof Inner) {
        return { [INNER_KEY]: value.patch }
    } else if (isValidToDecodeInner({ value })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Inner.decode = function({ value }) {
    if (isValidToDecodeInner({ value })) {
        return new Inner(value[INNER_KEY])
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
