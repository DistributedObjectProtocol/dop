import { isObject } from './is'

// https://jsperf.com/dop-foreachobject
export default function forEachObject(origin, callback, destiny) {
    const circular = []
    const path = []
    const has_destiny = isObject(destiny)
    forEachObjectLoop(origin, destiny, callback, circular, path, has_destiny)
}

function forEachObjectLoop(
    origin,
    destiny,
    callback,
    circular,
    path,
    has_destiny
) {
    for (const prop in origin) {
        path.push(prop)

        const value_origin = origin[prop]
        const skip = callback({ origin, destiny, prop, path })

        if (
            isObject(value_origin) &&
            skip !== true &&
            value_origin !== origin &&
            // (!has_destiny ||
            //     (has_destiny && destiny[prop] !== undefined)) &&
            circular.indexOf(value_origin) == -1
        ) {
            circular.push(value_origin)
            forEachObjectLoop(
                value_origin,
                has_destiny ? destiny[prop] : undefined,
                callback,
                circular,
                path,
                has_destiny
            )
        }

        path.pop()
    }
}
