import forEachObject from './forEachObject'
import { is, isPlain } from './is'

// https://jsperf.com/merge-challenge
export default function merge(target, patch) {
    const args = arguments
    if (args.length > 2) {
        // Remove the target 2 arguments of the arguments and add thoose arguments as merged at the begining
        Array.prototype.splice.call(args, 0, 2, merge.call(this, target, patch))
        // Recursion
        return merge.apply(this, args)
    } else if (patch === target) {
        return target
    } else {
        forEachObject(patch, target, mergeMutator)
        return target
    }
}

export function mergeMutator({ patch, target, prop }) {
    const origin_value = patch[prop]
    const destiny_value = target[prop]
    const tof_origin = is(origin_value)
    const tof_destiny = is(destiny_value)
    if (isPlain(origin_value)) {
        if (!target.hasOwnProperty(prop) || tof_origin != tof_destiny) {
            target[prop] = tof_origin == 'array' ? [] : {}
        }
    } else {
        target[prop] = origin_value
        return false // we dont go deeper
    }
}

// export default createCustomMerge('merge', ({ patch, target, prop }) => {
//     const origin_value = patch[prop]
//     const destiny_value = target[prop]
//     const tof_origin = is(origin_value)
//     const tof_destiny = is(destiny_value)
//     if (isPlain(origin_value)) {
//         if (!target.hasOwnProperty(prop) || tof_origin !== tof_destiny) {
//             target[prop] = tof_origin === 'array' ? [] : {}
//             if (tof_origin === 'array') {
//                 const array = []
//                 if (tof_destiny === 'object') {
//                     Object.keys(destiny_value)
//                         .filter(key => !isNaN(Number(key)))
//                         .forEach(key => (array[key] = destiny_value[key]))
//                 }
//                 target[prop] = array
//             } else {
//                 target[prop] = {}
//             }
//         }
//     } else if (tof_origin === 'undefined' && target.hasOwnProperty(prop)) {
//         //skipping
//     } else {
//         target[prop] = origin_value
//         return true // skipping
//     }
// })

// // https://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
// export default function createCustomMerge(function_name, mutator) {
//     return createFunction(function_name, function recursive(target, patch) {
//         const args = arguments
//         if (args.length > 2) {
//             // Remove the target 2 arguments of the arguments and add thoose arguments as recursived at the begining
//             Array.prototype.splice.call(
//                 args,
//                 0,
//                 2,
//                 recursive.call(this, target, patch)
//             )
//             // Recursion
//             return recursive.apply(this, args)
//         } else if (patch === target) {
//             return target
//         } else {
//             forEachObject(patch, mutator, target)
//             return target
//         }
//     })
// }
