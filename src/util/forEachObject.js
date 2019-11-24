import { isObject } from './is'
import forEach from './forEach'

// https://jsperf.com/dop-foreachobject
// https://2ality.com/2019/10/shared-mutable-state.html
export default function forEachObject(origin, callback, destiny) {
    const circular = new Map()
    const path = []
    const has_destiny = isObject(destiny)
    forEachObjectLoop(origin, destiny, callback, path, has_destiny, circular)
}

function forEachObjectLoop(
    origin,
    destiny,
    callback,
    path,
    has_destiny,
    circular
) {
    forEach(origin, (value_origin, prop) => {
        path.push(prop)

        const go_deep = callback({ origin, destiny, prop, path })

        if (
            isObject(value_origin) &&
            go_deep !== false &&
            value_origin !== origin &&
            // (!has_destiny ||
            //     (has_destiny && destiny[prop] !== undefined)) &&
            !circular.has(value_origin)
        ) {
            circular.set(value_origin, 1)
            forEachObjectLoop(
                value_origin,
                has_destiny ? destiny[prop] : undefined,
                callback,
                path,
                has_destiny,
                circular
            )
        }

        path.pop()
    })
}
