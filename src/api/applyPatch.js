import { is, isPojo } from '../util/is'

export default function applyPatch(object, patch) {
    forEachObject(
        patch,
        ({ origin, destiny, prop, path }) => {
            const origin_value = origin[prop]
            const destiny_value = destiny[prop]
            const tof_origin = is(origin_value)
            const tof_destiny = is(destiny_value)
            if (isPojo(origin_value)) {
                if (
                    !destiny.hasOwnProperty(prop) ||
                    tof_origin != tof_destiny
                ) {
                    destiny[prop] = tof_origin == 'array' ? [] : {}
                }
            } else {
                destiny[prop] = origin_value
                return true // skipping
            }
        },
        object
    )
    return { mutations: [], unpatch: {} }
}
