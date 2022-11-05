import { ESCAPE_KEY, SPLICE_KEY } from '../const'
import { isArray, isValidToEscape } from '../util/is'
import { getUniqueKey } from '../util/getset'

export default function Splice(...args) {
    if (!(this instanceof Splice)) {
        return new Splice(...args)
    }
    this.args = args
}

Splice.patch = function ({ patch, target, prop, old_value }) {
    const patch_value = patch[prop]
    if (patch_value instanceof Splice) {
        target[prop] = old_value
        if (isArray(old_value)) {
            const { args } = patch_value
            if (args[0] < 0) {
                args[0] = old_value.length + args[0]
            }
            const spliced = old_value.splice.apply(old_value, args)
            const inverted = [args[0], args.length - 2].concat(spliced)
            return Splice.apply(null, inverted)
        }
    }
    return old_value
}

Splice.encode = function ({ value, encode }) {
    if (value instanceof Splice) {
        return { [SPLICE_KEY]: encode(value.args) }
    } else if (isValidToDecode({ value, key: SPLICE_KEY })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Splice.decode = function ({ value, decode }) {
    if (isValidToDecode({ value, key: SPLICE_KEY })) {
        return Splice.apply(null, decode(value[SPLICE_KEY]))
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: SPLICE_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}

function isValidToDecode({ value }) {
    return getUniqueKey(value) === SPLICE_KEY && isArray(value[SPLICE_KEY])
}
