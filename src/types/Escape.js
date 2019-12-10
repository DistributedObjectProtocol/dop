import { getUniqueKey } from '../util/get'

export default function factoryEscape({ types }) {
    const key = '$escape'
    let escaped_stringify
    let escaped_parse

    // Constructor/Creator
    function Escape() {}

    Escape.key = key

    Escape.isValidToStringify = function(value, prop, object) {
        if (escaped_stringify.has(value)) return true
        const type = types[getUniqueKey(value, types)]
        return type !== undefined && type.isValidToParse(value, prop, object)
    }

    Escape.isValidToParse = function(value, prop, object) {
        if (escaped_parse.has(value)) return true
        if (prop === key && key === getUniqueKey(object, types)) {
            escaped_parse.set(object, 1)
            const type = types[getUniqueKey(value, types)]
            return (
                type !== undefined && type.isValidToParse(value, prop, object)
            )
        }
        return false
    }

    Escape.stringify = function(value) {
        if (escaped_stringify.has(value)) return value
        escaped_stringify.set(value, 1)
        value = { [key]: value }
        return value
    }

    Escape.parse = function(value) {
        return escaped_parse.has(value) ? value[key] : value
    }

    Escape.beforeStringify = function() {
        escaped_stringify = new Map()
    }

    Escape.beforeParse = function() {
        escaped_parse = new Map()
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
