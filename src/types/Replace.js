import { ESCAPE_KEY, REPLACE_KEY } from '../const'
import { isValidToDecode, isValidToEscape } from '../util/isValid'

export default function Replace(value) {
    if (!(this instanceof Replace)) {
        return new Replace(value)
    }
    this.value = value
}

Replace.patch = function({ origin, destiny, prop, oldValue }) {
    if (origin[prop] instanceof Replace) {
        destiny[prop] = origin[prop].value
        return new Replace(oldValue)
    }
    return oldValue
}

Replace.encode = function({ value }) {
    if (value instanceof Replace) {
        return { [REPLACE_KEY]: value.value } // we don't go deeper
    } else if (isValidToDecode({ value, key: REPLACE_KEY })) {
        return { [ESCAPE_KEY]: value } // we don't go deeper
    }
    return value
}

Replace.decode = function({ value }) {
    if (isValidToDecode({ value, key: REPLACE_KEY })) {
        return new Replace(value[REPLACE_KEY])
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: REPLACE_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}
