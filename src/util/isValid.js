import { getUniqueKey } from '../util/get'
import { ESCAPE_KEY } from '../const'

export function isValidToDecode({ value, key }) {
    return getUniqueKey(value) === key && value.hasOwnProperty(key)
}

export function isValidToEscape({ value }) {
    return getUniqueKey(value) === ESCAPE_KEY
}
