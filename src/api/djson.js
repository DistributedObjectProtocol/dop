import { isPojoObject } from '../util/is'

const TYPES = {
    // $escape: {
    //     stringify: value => {
    //         $escape: value
    //     }
    // },
    $delete: {
        isValid: value => value === 0
    }
}

function isValidEscape(object) {
    if (!isPojoObject(object)) return
    let type_name
    for (const key in object) {
        if (!TYPES.hasOwnProperty(key) || type_name !== undefined) {
            return
        }
        type_name = key
    }
    return TYPES[type_name].isValid(object[type_name]) ? type_name : undefined
}

function stringify(object) {
    const escaped = new Map()
    return JSON.stringify(object, function(prop, value) {
        // console.log('--')
        // console.log(prop, value)
        // console.log('--')
        if (!escaped.has(value)) {
            const type_name = isValidEscape(value)
            if (type_name !== undefined) {
                console.log('ESCAPE', type_name)
                escaped.set(value, true)
                return { $escape: value }
            }
            if (value === undefined) {
                return { $delete: 0 }
            }
        }

        return value
    })
}

const DJSON = { stringify }

export default DJSON
