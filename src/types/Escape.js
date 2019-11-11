import { isPojoObject } from '../util/is'

export default function factoryDelete({ types, getUniqueKey }) {
    const key = '$escape'
    const escaped_parse = []
    let escaped_stringify

    // Constructor/Creator
    function Escape() {}

    Escape.key = key

    Escape.stringify = function(value, prop, object) {
        if (!isPojoObject(value) || escaped_stringify.has(value)) {
            return value
        }

        const unique_key = getUniqueKey(value)
        if (unique_key === undefined) {
            return value
        }

        escaped_stringify.set(value, true)
        return { [key]: value }
    }

    Escape.parse = function(value, prop, object) {
        const unique_key = getUniqueKey(value)
        if (unique_key === key) {
            escaped_parse.push({ value, prop, object })
            return {}
        }
        return value
    }

    Escape.beforeStringify = function() {
        escaped_stringify = new Map()
    }

    Escape.afterParse = function(value, prop) {
        console.log('afterParse', escaped_parse)
        while (escaped_parse.length > 0) {
            const { object, prop, value } = escaped_parse.shift()
            object[prop] = value[key]
        }
    }

    return Escape
}

// DJSON.addType(Escape.key, ({ isValidToParse }) => {
//     let escaped
//     return {
//         isValidToStringify: (value, prop, object) => {
//             if (!escaped.has(value)) {
//                 const type_name = isValidToParse(value, prop, object)
//                 if (type_name !== undefined) {
//                     escaped.set(value, true)
//                     return true
//                 }
//             }
//             return false
//         },
//         isValidToParse: () => true,
//         stringify: value => ({ [escape]: value }),
//         parse: value => value[escape],
//         beforeStringify: () => (escaped = new Map())
//     }
// })
