import { ESCAPE_KEY, DELETE_KEY } from '../const.js'
import { isValidToEscape } from '../util/is.js'
import { getUniqueKey } from '../util/getset.js'

export default function Delete() {
    if (!(this instanceof Delete)) {
        return new Delete()
    }
}

Delete.patch = function ({ patch, target, prop, old_value }) {
    if (patch[prop] instanceof Delete || patch[prop] === Delete) {
        delete target[prop]
    }
    return old_value
}

Delete.encode = function ({ value }) {
    if (value instanceof Delete || value === Delete) {
        return { [DELETE_KEY]: 0 }
    } else if (isValidToDecodeDelete({ value })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Delete.decode = function ({ value }) {
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
