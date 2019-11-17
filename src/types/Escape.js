import { isPojoObject, isFunction } from '../util/is'

export default function factoryEscape({ types, getUniqueKey }) {
    const key = '$escape'
    const escaped_parse = []
    let escaped_stringify

    // Constructor/Creator
    function Escape() {}

    Escape.key = key

    Escape.isValidToStringify = function(value, prop, object) {
        if (escaped_stringify.has(value)) return true
        const type = types[getUniqueKey(value)]
        return type !== undefined && type.isValidToParse(value, prop, object)
    }

    Escape.isValidToParse = function(value, prop, object) {
        return false
    }

    Escape.stringify = function(value, prop, object) {
        if (escaped_stringify.has(value)) return value
        escaped_stringify.set(value, 1)
        value = { [key]: value }
        return value
    }

    Escape.parse = function(value, prop, object) {
        return value[$key]
    }

    Escape.beforeStringify = function() {
        escaped_stringify = new Map()
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
