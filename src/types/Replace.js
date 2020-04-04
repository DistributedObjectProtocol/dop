import { ESCAPE_KEY, REPLACE_KEY } from '../const'
import { isValidToEscape, isValidToDecode } from '../util/isValid'

export default function Replace(value) {
    if (!(this instanceof Replace)) {
        return new Replace(value)
    }
    this.value = value
}

Replace.patch = function ({ patch, target, prop, old_value }) {
    if (patch[prop] instanceof Replace) {
        target[prop] = patch[prop].value
        return new Replace(old_value)
    }
    return old_value
}

Replace.encode = function ({ value }) {
    if (value instanceof Replace) {
        return { [REPLACE_KEY]: value.value } // we don't go deeper
    } else if (isValidToDecode({ value, key: REPLACE_KEY })) {
        return { [ESCAPE_KEY]: value } // we don't go deeper
    }
    return value
}

Replace.decode = function ({ value }) {
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
