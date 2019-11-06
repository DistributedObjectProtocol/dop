export default function factoryDelete() {
    const key = '$delete'

    // Constructor/Creator
    function Delete() {
        return undefined
    }

    Delete.key = key

    Delete.isValidToStringify = function(value) {
        return value === undefined
    }

    Delete.stringify = function() {
        return { [key]: 0 }
    }

    const undefineds = []
    Delete.isValidToParse = function(value) {
        return value[key] === 0
    }

    Delete.parse = function(value, prop, object) {
        undefineds.push({ prop, object })
        return value
    }

    Delete.afterParse = parsed => {
        while (undefineds.length > 0) {
            const { object, prop } = undefineds.shift()
            object[prop] = undefined
        }
    }

    return Delete
}

// export default function factoryDelete() {
//     const key = '$delete'

//     // Constructor/Creator
//     function Delete() {
//         if (!(this instanceof Delete)) {
//             return new Delete()
//         }
//     }

//     Delete.key = key

//     Delete.isValidToStringify = function(value) {
//         return value instanceof Delete
//     }

//     Delete.stringify = function() {
//         return { [key]: 0 }
//     }

//     Delete.isValidToParse = function(value) {
//         return value[key] === 0
//     }

//     Delete.parse = function() {
//         return new Delete()
//     }

//     return Delete
// }

// DJSON.setType('$delete', () => {
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
