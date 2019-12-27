import { ESCAPE_KEY, REPLACE_KEY } from '../const'
import { getUniqueKey } from '../util/get'

export default function Replace(value) {
    if (!(this instanceof Replace)) {
        return new Replace(value)
    }
    this.value = value
}

Replace.patch = function({ destiny, prop, oldValue }) {
    if (destiny[prop] instanceof Replace) {
        destiny[prop] = destiny[prop].value
    }
    return oldValue
}

Replace.encode = function({ value }) {
    if (value instanceof Replace) {
        return { [REPLACE_KEY]: value.value } // we don't go deeper
    } else if (isValidToDecode({ value })) {
        return { [ESCAPE_KEY]: value } // we don't go deeper
    }
    return value
}

Replace.decode = function({ value }) {
    if (isValidToDecode({ value })) {
        return new Replace(value[REPLACE_KEY])
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
        getUniqueKey(value) === REPLACE_KEY && value.hasOwnProperty(REPLACE_KEY)
    )
}

function isValidToEscape({ value }) {
    return getUniqueKey(value) === ESCAPE_KEY
}
