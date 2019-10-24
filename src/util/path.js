import { is, isFunction, isObject } from './is'

export default function path(origin, callback, destiny = {}) {
    pathRecursive(
        origin,
        callback,
        destiny,
        [],
        [],
        isFunction(callback),
        isObject(destiny)
    )
    return destiny
}

function pathRecursive(
    origin,
    callback,
    destiny,
    circular,
    path,
    has_callback,
    has_destiny
) {
    for (const prop in origin) {
        const value = origin[prop]
        const tof_value = is(value)

        path.push(prop)

        // skip = callback(origin, prop, value, destiny, path, this)
        const skip = has_callback
            ? callback(origin, destiny, prop, path)
            : // ? callback(destiny, prop, value, tof_value, path)
              false

        // Objects or arrays
        if (
            (tof_value == 'object' || tof_value == 'array') &&
            skip !== true &&
            value !== origin &&
            circular.indexOf(value) == -1 &&
            (has_destiny && destiny[prop] !== undefined)
        ) {
            circular.push(value)
            pathRecursive(
                value,
                callback,
                has_destiny ? destiny[prop] : undefined,
                circular,
                path,
                has_callback,
                has_destiny
            )
        }

        path.pop()
    }
}
