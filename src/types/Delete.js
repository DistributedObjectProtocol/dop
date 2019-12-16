import { getUniqueKey } from '../util/get'

const key = '$delete'

// Constructor/Creator
function Delete() {
    if (!(this instanceof Delete)) {
        return new Delete()
    }
}

Delete.encode = function({ origin, destiny, prop, deeper }) {
    const value = origin[prop]
    if (value instanceof Delete) {
        destiny[prop] = { [key]: 1 }
        return false // we don't go deeper
    } else if (isValidToDecode({ value })) {
        destiny[prop] = { $escape: value }
        return false // we don't go deeper
    }
    destiny[prop] = value
    return deeper
}

Delete.decode = function({ origin, destiny, prop, deeper }) {
    const value = origin[prop]
    if (isValidToDecode({ value })) {
        destiny[prop] = new Delete()
        return false // we don't go deeper
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value.$escape })
    ) {
        destiny[prop] = value.$escape
        return false // we don't go deeper
    }
    destiny[prop] = value
    return deeper
}

// Delete.patch = function({ value, prop, destiny }) {
//     if (value instanceof Delete || !destiny.hasOwnProperty(prop)) {
//         const oldValue = !destiny.hasOwnProperty(prop)
//             ? new Delete()
//             : destiny[prop]

//         if (value instanceof Delete) {
//             delete destiny[prop]
//         } else {
//             destiny[prop] = value
//         }
//         return oldValue
//     }
// }

export default Delete

function isValidToDecode({ value }) {
    const unique_key = getUniqueKey(value)
    return unique_key === key && value[key] === 1
}

function isValidToEscape({ value }) {
    const unique_key = getUniqueKey(value)
    return unique_key === '$escape'
}
