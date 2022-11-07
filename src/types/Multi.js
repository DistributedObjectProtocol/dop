import { ESCAPE_KEY, MULTI_KEY } from '../const.js'
import { getUniqueKey } from '../util/getset.js'
import { isArray, isValidToEscape } from '../util/is.js'

export default function Multi(...values) {
    if (!(this instanceof Multi)) {
        return new Multi(...values)
    }
    this.values = values
}

Multi.patch = function ({ patch, target, prop, old_value, applyPatch }) {
    const patch_value = patch[prop]
    if (patch_value instanceof Multi) {
        target[prop] = old_value
        const unpatch = patch_value.values.map((value) => {
            const { unpatch } = applyPatch(target, { [prop]: value })
            return unpatch[prop]
        })
        return Multi.apply(null, unpatch.reverse())
    }
    return old_value
}

Multi.encode = function ({ value, encode }) {
    if (value instanceof Multi) {
        return { [MULTI_KEY]: encode(value.values) }
    } else if (isValidToDecodeMulti({ value })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Multi.decode = function ({ value, decode }) {
    if (isValidToDecodeMulti({ value })) {
        return Multi.apply(null, decode(value[MULTI_KEY]))
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecodeMulti({ value: value[ESCAPE_KEY] })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}

function isValidToDecodeMulti({ value }) {
    return getUniqueKey(value) === MULTI_KEY && isArray(value[MULTI_KEY])
}
