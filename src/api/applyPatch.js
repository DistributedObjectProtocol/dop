import { is, isPojo } from '../util/is'
import forEachObject from '../util/forEachObject'
import merge from '../api/merge'

export default function applyPatch(object, patch) {
    const mutations = []
    const unpatch = {}
    forEachObject(
        patch,
        ({ origin, destiny, prop, path }) => {
            const origin_value = origin[prop]
            const destiny_value = destiny[prop]
            if (origin_value !== destiny_value) {
                const tof_origin = is(origin_value)
                const tof_destiny = is(destiny_value)
                if (isPojo(origin_value)) {
                    if (
                        !destiny.hasOwnProperty(prop) ||
                        tof_origin != tof_destiny
                    ) {
                        mutations.push(createMutation(destiny, prop, path))
                        // destiny[prop] = tof_origin == 'array' ? [] : {}
                        destiny[prop] = merge(
                            tof_origin == 'array' ? [] : {},
                            origin_value
                        )
                        return true // skipping
                    }
                } else {
                    mutations.push(createMutation(destiny, prop, path))
                    destiny[prop] = origin_value
                    return true // skipping
                }
            }
        },
        object
    )
    return { mutations, unpatch }
}

function createMutation(object, prop, path) {
    return {
        object,
        prop,
        path: path.slice(0),
        oldValue: object[prop]
    }
}
