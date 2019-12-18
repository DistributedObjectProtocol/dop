import { getUniqueKey } from '../util/get'

const key = '$delete'

// Constructor/Creator
// function Delete() {
//     return { [key]: 1 }
// }
function Delete() {
    if (!(this instanceof Delete)) {
        return new Delete()
    }
}

Delete.patch = function({ destiny, prop, oldValue, had_prop }) {
    const value = destiny[prop]
    // if (getUniqueKey(value) === key && value[key] === 1) {
    if (value instanceof Delete) {
        delete destiny[prop]
    }
    if (!had_prop) {
        oldValue = Delete()
    }
    return oldValue
}

export default Delete

// Delete.encode = function({ value, origin, destiny, prop }) {
//     if (value instanceof Delete) {
//         destiny[prop] = { [key]: 1 }
//         return false // we don't go deeper
//     } else if (isValidToDecode({ value })) {
//         destiny[prop] = { [ESCAPE_KEY]: value }
//         return false // we don't go deeper
//     }
//     return mergeMutator({ origin, destiny, prop })
// }

// Delete.decode = function({ value, origin, destiny, prop }) {
//     if (isValidToDecode({ value })) {
//         destiny[prop] = new Delete()
//         return false // we don't go deeper
//     } else if (
//         isValidToEscape({ value }) &&
//         isValidToDecode({ value: value[ESCAPE_KEY] })
//     ) {
//         destiny[prop] = value[ESCAPE_KEY]
//         return false // we don't go deeper
//     }
//     return mergeMutator({ origin, destiny, prop })
// }

// function isValidToDecode({ value }) {
//     const unique_key = getUniqueKey(value)
//     return unique_key === key && value[key] === 1
// }

// function isValidToEscape({ value }) {
//     const unique_key = getUniqueKey(value)
//     return unique_key === ESCAPE_KEY
// }
