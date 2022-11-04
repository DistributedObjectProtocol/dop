import { is, isPlain } from './is'
import { forEachDeep } from './forEach'
import { getDeep } from './getset'

// https://jsperf.com/merge-challenge
export function merge(target, patch) {
    const args = arguments
    if (args.length > 2) {
        // Remove the target 2 arguments of the arguments and add thoose arguments as merged at the begining
        Array.prototype.splice.call(args, 0, 2, merge.call(this, target, patch))
        // Recursion
        return merge.apply(this, args)
    } else if (patch === target) {
        return target
    } else {
        mergeCore(patch, target, mergeMutator)
        return target
    }
}

// https://jsperf.com/dop-foreachobject
// https://2ality.com/2019/10/shared-mutable-state.html
export function mergeCore(patch, target_root, mutator) {
    forEachDeep(patch, ({ object, prop, path }) => {
        const target = getDeep(target_root, path.slice(0, path.length - 1))
        const output = mutator({ patch: object, target, prop, path })
        return output !== false
    })
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

// Old version
// export default function mergeCore(patch, target, mutator, path = []) {
//     forEach(patch, (value_origin, prop) => {
//         path.push(prop)
//         const shallWeGoDown = mutator({ patch, target, prop, path })
//         if (shallWeGoDown !== false && isObject(value_origin)) {
//             mergeCore(value_origin, target[prop], mutator, path)
//         }
//         path.pop()
//     })
// }
