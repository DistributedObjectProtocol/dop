import { is } from './is'
import forEachObject from './forEachObject'

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
    } else {
        forEachObject(origin, mergeMutator, destiny)
        return destiny
    }
}

function mergeMutator({ origin, destiny, prop }) {
    const tof_origin = is(origin[prop])
    const tof_destiny = is(destiny[prop])
    if (tof_origin == 'object' || tof_origin == 'array') {
        !destiny.hasOwnProperty(prop)
            ? (destiny[prop] = tof_origin == 'array' ? [] : {})
            : destiny[prop]
    } else {
        destiny[prop] = origin[prop]
    }
}
