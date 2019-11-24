import { is, isPojo } from '../util/is'
import { setDeep } from '../util/set'
import forEachObject from '../util/forEachObject'
import merge from '../api/merge'

export default function applyPatchFactory(DJSON) {
    return function applyPatch(object, patch) {
        const mutations = []
        const unpatch = {}

        function addMutation({ destiny, prop, path }) {
            const oldValue = destiny[prop] // type.unpatch(destiny, prop)
            setDeep(unpatch, path.slice(0), oldValue)
            mutations.push({
                object: destiny,
                prop,
                path: path.slice(0),
                oldValue
            })
        }

        forEachObject(
            patch,
            ({ origin, destiny, prop, path }) => {
                const origin_value = origin[prop]
                const destiny_value = destiny[prop]
                const destiny_has_prop = destiny.hasOwnProperty(prop)
                if (!destiny_has_prop || origin_value !== destiny_value) {
                    if (isPojo(origin_value)) {
                        const tof_origin = is(origin_value)
                        const tof_destiny = is(destiny_value)
                        if (!destiny_has_prop || tof_origin != tof_destiny) {
                            addMutation({ destiny, prop, path })
                            destiny[prop] = merge(
                                tof_origin == 'array' ? [] : {},
                                origin_value
                            )
                            return false // if true we dont go deeper
                        }
                    } else {
                        addMutation({ destiny, prop, path })
                        destiny[prop] = origin_value
                        return false // if true we dont go deeper
                    }
                }
            },
            object
        )
        return { mutations, unpatch }
    }
}
