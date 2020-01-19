import { isArray } from '../util/is'
import { isValidToDecode, isValidToEscape } from '../util/isValid'
import { ESCAPE_KEY, SPLICE_KEY } from '../const'

export default function Splice(...args) {
    if (!(this instanceof Splice)) {
        return new Splice(...args)
    }
    this.args = args
}

Splice.patch = function({ origin, destiny, prop, oldValue }) {
    const origin_value = origin[prop]
    if (isArray(oldValue) && origin_value instanceof Splice) {
        destiny[prop] = oldValue
        const { args } = origin_value
        const spliced = oldValue.splice.apply(oldValue, args)
        const inverted = [args[0], args.length - 2].concat(spliced)
        return Splice.apply(null, inverted)
    }
    return oldValue
}

Splice.encode = function({ value }) {
    if (value instanceof Splice) {
        return { [SPLICE_KEY]: value.args }
    } else if (isValidToDecode({ value, key: SPLICE_KEY })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Splice.decode = function({ value }) {
    if (isValidToDecode({ value, key: SPLICE_KEY })) {
        return new Splice(value[SPLICE_KEY])
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: SPLICE_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}
