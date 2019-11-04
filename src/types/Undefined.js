export const name = '$undefined'

// Constructor/Creator
export default function Undefined() {
    if (!(this instanceof Undefined)) {
        return new Undefined()
    }
}

const undefineds = []

export function isValidToStringify(value) {
    return value === undefined
}

export function isValidToParse(value) {
    return value[name] === 0
}

export function stringify() {
    return { [name]: 0 }
}

export function parse(value, prop, object) {
    undefineds.push({ prop, object })
    return value
}

export function afterParse() {
    while (undefineds.length > 0) {
        const { object, prop } = undefineds.shift()
        object[prop] = undefined
    }
}
