export default function factoryUndefined() {
    const key = '$undefined'
    const undefineds = []

    // Constructor/Creator
    function Undefined() {
        return undefined
    }

    Undefined.key = key

    Undefined.isValidToStringify = function(value) {
        return value === undefined
    }

    Undefined.stringify = function() {
        return { [key]: 0 }
    }

    Undefined.isValidToParse = function(value) {
        return value[key] === 0
    }

    Undefined.parse = function(value, prop, object) {
        undefineds.push({ prop, object })
        return value
    }

    Undefined.afterParse = function() {
        while (undefineds.length > 0) {
            const { object, prop } = undefineds.shift()
            object[prop] = undefined
        }
    }

    return Undefined
}

// DJSON.addType('$delete', () => {
//     const undefineds = []
//     return {
//         isValidToStringify: value => value === undefined,
//         isValidToParse: (value, prop) => value.$delete === 0,
//         stringify: () => ({ $delete: 0 }),
//         parse: (value, prop, object) => {
//             undefineds.push({ prop, object })
//             return value
//         },
//         afterParse: parsed => {
//             while (undefineds.length > 0) {
//                 const { object, prop } = undefineds.shift()
//                 object[prop] = undefined
//             }
//         }
//     }
// })
