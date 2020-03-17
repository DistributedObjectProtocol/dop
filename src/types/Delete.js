import { ESCAPE_KEY, DELETE_KEY } from '../const'
import { getUniqueKey } from '../util/get'
import { isValidToEscape } from '../util/isValid'

export default function Delete() {
    if (!(this instanceof Delete)) {
        return new Delete()
    }
}

Delete.patch = function({ origin, destiny, prop, old_value, had_prop }) {
    if (origin[prop] instanceof Delete || origin[prop] === Delete) {
        delete destiny[prop]
    }
    if (!had_prop) {
        old_value = new Delete()
    }
    return old_value
}

Delete.encode = function({ value }) {
    if (value instanceof Delete || value === Delete) {
        return { [DELETE_KEY]: 0 } // we don't go deeper
    } else if (isValidToDecodeDelete({ value })) {
        return { [ESCAPE_KEY]: value } // we don't go deeper
    }
    return value
}

Delete.decode = function({ value }) {
    if (isValidToDecodeDelete({ value })) {
        return new Delete()
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecodeDelete({ value: value[ESCAPE_KEY] })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}

function isValidToDecodeDelete({ value }) {
    return getUniqueKey(value) === DELETE_KEY && value[DELETE_KEY] === 0
}
