import { is, isFunction } from './is'

export default function path(origin, callback, destiny = {}) {
    const has_callback = isFunction(callback)
    const circular = []
    const path = []
    pathRecursive(origin, destiny, callback, has_callback, circular, path)
}

function pathRecursive(
    origin,
    destiny,
    callback,
    has_callback,
    circular,
    path
) {
    for (const prop in origin) {
        const value_origin = origin[prop]
        const tof_origin = is(value_origin)

        path.push(prop)

        const skip = has_callback
            ? callback(origin, destiny, prop, path)
            : false

        // Objects or arrays
        if (
            (tof_origin == 'object' || tof_origin == 'array') &&
            skip !== true &&
            // value_origin !== origin &&
            circular.indexOf(value_origin) == -1 &&
            destiny[prop] !== undefined
        ) {
            circular.push(value_origin)
            // pathRecursive(value_origin, destiny[prop], circular, path)
            pathRecursive(
                value_origin,
                destiny[prop],
                callback,
                has_callback,
                circular,
                path
            )
        }

        path.pop()
    }
}
