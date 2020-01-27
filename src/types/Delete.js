import { ESCAPE_KEY, DELETE_KEY } from '../const'
import { getUniqueKey } from '../util/get'
import { isValidToEscape } from '../util/isValid'

export default function Delete() {
    if (!(this instanceof Delete)) {
        return new Delete()
    }
}

Delete.patch = function({ origin, destiny, prop, oldValue, had_prop }) {
    if (origin[prop] instanceof Delete || origin[prop] === Delete) {
        delete destiny[prop]
    }
    if (!had_prop) {
        oldValue = new Delete()
    }
    return oldValue
}

Delete.encode = function({ value }) {
    if (value instanceof Delete || value === Delete) {
        return { [DELETE_KEY]: 0 } // we don't go deeper
    } else if (isValidToDecode({ value })) {
        return { [ESCAPE_KEY]: value } // we don't go deeper
    }
    return value
}

Delete.decode = function({ value }) {
    if (isValidToDecode({ value })) {
        return new Delete()
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY] })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}

function isValidToDecode({ value }) {
    return getUniqueKey(value) === DELETE_KEY && value[DELETE_KEY] === 0
}
