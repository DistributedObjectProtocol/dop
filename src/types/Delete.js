import { DELETE_KEY, ESCAPE_KEY } from '../const'
import { getUniqueKey } from '../util/get'

function Delete() {
    if (!(this instanceof Delete)) {
        return new Delete()
    }
}

Delete.patch = function({ destiny, prop, oldValue, had_prop }) {
    if (destiny[prop] instanceof Delete) {
        delete destiny[prop]
    }
    if (!had_prop) {
        oldValue = new Delete()
    }
    return oldValue
}

Delete.encode = function({ value }) {
    if (value instanceof Delete) {
        return { [DELETE_KEY]: 1 } // we don't go deeper
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
    return getUniqueKey(value) === DELETE_KEY && value[DELETE_KEY] === 1
}

function isValidToEscape({ value }) {
    return getUniqueKey(value) === ESCAPE_KEY
}

export default Delete
