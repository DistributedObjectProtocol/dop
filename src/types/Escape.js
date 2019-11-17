import { isPojoObject, isFunction } from '../util/is'

export default function factoryDelete({ types, getUniqueKey }) {
    const key = '$escape'
    const escaped_parse = []

    // Constructor/Creator
    function Escape() {}

    Escape.key = key

    Escape.stringify = function(value, prop, object) {
        if (!isPojoObject(value)) {
            return value
        }

        const type = types[getUniqueKey(value)]
        if (
            type === undefined ||
            !(
                isFunction(type.isValidToParse) &&
                type.isValidToParse(value, prop, object)
            )
        ) {
            return value
        }

        return { [key]: value }
    }

    Escape.parse = function(value, prop, object) {
        // const type = types[getUniqueKey(value)]
        // if (
        //     prop === key &&
        //     type !== undefined &&
        //     isFunction(type.isValidToParse) &&
        //     type.isValidToParse(value, prop, object)
        // ) {
        //     return value[key]
        // }

        return value
    }

    // Escape.beforeStringify = function() {
    //     escaped_stringify = new Map()
    // }

    // Escape.afterStringify = function() {
    //     while (escaped_stringify.length > 0) {
    //         const { object, prop, value } = escaped_stringify.shift()
    //         object[prop] = { [key]: value }
    //     }
    // }

    // Escape.afterParse = function(value, prop) {
    //     while (escaped_parse.length > 0) {
    //         const { object, prop, value } = escaped_parse.shift()
    //         object[prop] = value[key]
    //     }
    // }

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
