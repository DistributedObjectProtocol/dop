import { isPojoObject } from '../util/is'

const TYPES = {
    $escape: {
        //     //     stringify: value => {
        //     //         $escape: value
        //     //     }
        isValidToStringify: value => false,
        isValidToParse: value => true
    },
    $delete: {
        isValidToStringify: value => value === undefined,
        stringify: value => ({ $delete: 0 }),
        isValidToParse: value => value === 0
    },
    $date: {
        isValidToStringify: value => value instanceof Date,
        stringify: value => ({ $date: new Date(value).getTime() }),
        isValidToParse: value => value === 0
    }
}

function isValidToEscape(object) {
    if (!isPojoObject(object)) return
    let type_name
    for (const key in object) {
        if (!TYPES.hasOwnProperty(key) || type_name !== undefined) {
            return
        }
        type_name = key
    }
    return TYPES[type_name].isValidToParse(object[type_name])
        ? type_name
        : undefined
}

function isValidToStringify(value) {
    for (const type_name in TYPES) {
        if (TYPES[type_name].isValidToStringify(value)) {
            return type_name
        }
    }
}

function stringify(object) {
    const escaped = new Map()
    const stringified = new Map()
    return JSON.stringify(object, function(prop, value) {
        if (
            value !== object &&
            !stringified.has(value) &&
            !escaped.has(value)
        ) {
            // console.log('--')
            // console.log(prop, value)
            // console.log('--')
            if (isValidToEscape(value) !== undefined) {
                escaped.set(value, true)
                return { $escape: value }
            }
            const type_name = isValidToStringify(value)
            if (type_name !== undefined) {
                value = TYPES[type_name].stringify(value)
                stringified.set(value, true)
                return value
            }
        }

        return value
    })
}

const DJSON = { stringify }

export default DJSON
