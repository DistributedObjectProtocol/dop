import { ESCAPE_KEY, INNER_KEY } from '../const'
import { isValidToDecode, isValidToEscape } from '../util/isValid'
import { isArray } from '../util/is'

export default function Inner(patch) {
    if (!(this instanceof Inner)) {
        return new Inner(patch)
    }
    this.patch = patch
}

Inner.patch = function({ origin, destiny, prop, oldValue, applyPatch }) {
    const origin_value = origin[prop]
    if (isArray(oldValue) && origin_value instanceof Inner) {
        console.log('entra', oldValue, origin_value.patch)
        const { unpatch } = applyPatch(oldValue, origin_value.patch)
        console.log(oldValue)
        // destiny[prop] = origin_value.patch
        // return new Inner(oldValue)
        return unpatch
    }
    return oldValue
}

Inner.encode = function({ value }) {
    if (value instanceof Inner) {
        return { [INNER_KEY]: value.value } // we don't go deeper
    } else if (isValidToDecode({ value, key: INNER_KEY })) {
        return { [ESCAPE_KEY]: value } // we don't go deeper
    }
    return value
}

Inner.decode = function({ value }) {
    if (isValidToDecode({ value, key: INNER_KEY })) {
        return new Inner(value[INNER_KEY])
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: INNER_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}
