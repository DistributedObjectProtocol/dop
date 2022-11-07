import { ESCAPE_KEY, REPLACE_KEY } from '../const.js'
import { isValidToEscape, isValidToDecode } from '../util/is.js'
import Delete from './Delete.js'

export default function Replace(value) {
    if (!(this instanceof Replace)) {
        return new Replace(value)
    }
    this.value = value
}

Replace.patch = function ({ patch, target, prop, old_value }) {
    if (patch[prop] instanceof Replace) {
        target[prop] = patch[prop].value
        return old_value instanceof Delete ? old_value : new Replace(old_value)
    }
    return old_value
}

Replace.encode = function ({ value, encode }) {
    if (value instanceof Replace) {
        return { [REPLACE_KEY]: encode(value.value) }
    } else if (isValidToDecode({ value, key: REPLACE_KEY })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Replace.decode = function ({ value, decode }) {
    if (isValidToDecode({ value, key: REPLACE_KEY })) {
        return new Replace(decode(value[REPLACE_KEY]))
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: REPLACE_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}
