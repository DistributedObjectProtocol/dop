export const name = '$delete'

export default function Delete() {
    if (!(this instanceof Delete)) {
        return new Delete()
    }
}

export function isValidToStringify(value) {
    return value instanceof Delete
}

export function stringify() {
    return { [name]: 0 }
}

export function isValidToParse(value) {
    return value[name] === 0
}

export function parse() {
    return new Delete()
}
