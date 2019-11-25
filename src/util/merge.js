import { is, isPlain } from '../util/is'
import forEachObject from '../util/forEachObject'

// https://jsperf.com/merge-challenge
export default function merge(destiny, origin) {
    const args = arguments
    if (args.length > 2) {
        // Remove the destiny 2 arguments of the arguments and add thoose arguments as merged at the begining
        Array.prototype.splice.call(
            args,
            0,
            2,
            merge.call(this, destiny, origin)
        )
        // Recursion
        return merge.apply(this, args)
    } else if (origin === destiny) {
        return destiny
    } else {
        forEachObject(origin, mergeMutator, destiny)
        return destiny
    }
}

function mergeMutator({ origin, destiny, prop }) {
    const origin_value = origin[prop]
    const destiny_value = destiny[prop]
    const tof_origin = is(origin_value)
    const tof_destiny = is(destiny_value)
    if (isPlain(origin_value)) {
        if (!destiny.hasOwnProperty(prop) || tof_origin != tof_destiny) {
            destiny[prop] = tof_origin == 'array' ? [] : {}
        }
    } else {
        destiny[prop] = origin_value
        return false // we dont go deeper
    }
}

// export default createCustomMerge('merge', ({ origin, destiny, prop }) => {
//     const origin_value = origin[prop]
//     const destiny_value = destiny[prop]
//     const tof_origin = is(origin_value)
//     const tof_destiny = is(destiny_value)
//     if (isPlain(origin_value)) {
//         if (!destiny.hasOwnProperty(prop) || tof_origin != tof_destiny) {
//             destiny[prop] = tof_origin == 'array' ? [] : {}
//             if (tof_origin == 'array') {
//                 const array = []
//                 if (tof_destiny == 'object') {
//                     Object.keys(destiny_value)
//                         .filter(key => !isNaN(Number(key)))
//                         .forEach(key => (array[key] = destiny_value[key]))
//                 }
//                 destiny[prop] = array
//             } else {
//                 destiny[prop] = {}
//             }
//         }
//     } else if (tof_origin == 'undefined' && destiny.hasOwnProperty(prop)) {
//         //skipping
//     } else {
//         destiny[prop] = origin_value
//         return true // skipping
//     }
// })

// // https://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
// export default function createCustomMerge(function_name, mutator) {
//     return createFunction(function_name, function recursive(destiny, origin) {
//         const args = arguments
//         if (args.length > 2) {
//             // Remove the destiny 2 arguments of the arguments and add thoose arguments as recursived at the begining
//             Array.prototype.splice.call(
//                 args,
//                 0,
//                 2,
//                 recursive.call(this, destiny, origin)
//             )
//             // Recursion
//             return recursive.apply(this, args)
//         } else if (origin === destiny) {
//             return destiny
//         } else {
//             forEachObject(origin, mutator, destiny)
//             return destiny
//         }
//     })
// }
