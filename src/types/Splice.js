import { isArray } from '../util/is'
import { ESCAPE_KEY, SPLICE_KEY } from '../const'
import { getUniqueKey } from '../util/get'

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
    } else if (isValidToDecode({ value })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Splice.decode = function({ value }) {
    if (isValidToDecode({ value })) {
        return new Splice(value[SPLICE_KEY])
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY] })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}

function isValidToDecode({ value }) {
    return (
        getUniqueKey(value) === SPLICE_KEY && value.hasOwnProperty(SPLICE_KEY)
    )
}

function isValidToEscape({ value }) {
    return getUniqueKey(value) === ESCAPE_KEY
}
