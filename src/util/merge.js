import { is, isPlain, isArray } from './is.js'
import { forEachDeep } from './forEach.js'
import { getDeep } from './getset.js'

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

export function converter(patch, params, converters) {
    const patch_root = { '': patch } // a trick to allow top level
    const target_root = { '': isArray(patch) ? [] : {} } // a trick to allow top level
    mergeCore(patch_root, target_root, ({ patch, prop, target, path }) => {
        const value = converters.reduce(
            (value, converter) =>
                converter(
                    merge(
                        {
                            value,
                            patch,
                            target,
                            prop,
                            path,
                        },
                        params
                    )
                ),
            patch[prop]
        )
        if (patch[prop] !== value) {
            target[prop] = value
            return false // we don't go deeper
        } else {
            return mergeMutator({ patch, target, prop })
        }
    })
    return target_root['']
}
