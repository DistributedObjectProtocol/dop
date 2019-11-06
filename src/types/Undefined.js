export const key = '$undefined'

// Constructor/Creator
export default function Undefined() {
    return undefined
}

const undefineds = []

export function isValidToStringify(value) {
    return value === undefined
}

export function isValidToParse(value) {
    return value[key] === 0
}

export function stringify() {
    return { [key]: 0 }
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
