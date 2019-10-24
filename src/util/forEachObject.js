import { isObject } from './is'

export default function forEachObject(origin, callback, destiny) {
    const has_destiny = isObject(destiny)
    const circular = []
    const path = []
    ;(function recursive(origin, destiny) {
        for (const prop in origin) {
            const value_origin = origin[prop]

            path.push(prop)

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
                recursive(value_origin, has_destiny ? destiny[prop] : undefined)
            }

            path.pop()
        }
    })(origin, destiny)
}
