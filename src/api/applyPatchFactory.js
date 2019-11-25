import { is, isPojo, isPojoObject } from '../util/is'
import { getNewPojo } from '../util/get'
import { setDeep } from '../util/set'
import forEachObject from '../util/forEachObject'
import merge from '../api/merge'

export default function applyPatchFactory(DJSON) {
    return function applyPatch(object, patch) {
        if (!isPojoObject(object) || !isPojoObject(patch)) {
            throw 'applyPatch only accepts plain objects'
        }

        const mutations = []
        const unpatch = {}

        function addMutation({ value, prop, destiny, origin, path }) {
            const oldValue = DJSON.patch(value, prop, destiny, origin, path)
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
                    const value = getNewPojo(origin_value)
                    addMutation({ value, prop, destiny, origin, path })
                    return false // if false we dont go deeper

                    // if (isPojo(origin_value)) {
                    //     const tof_origin = is(origin_value)
                    //     const tof_destiny = is(destiny_value)
                    //     if (!destiny_has_prop || tof_origin != tof_destiny) {
                    //         const value = merge(
                    //             tof_origin == 'array' ? [] : {},
                    //             origin_value
                    //         )
                    //         addMutation({ value, prop, destiny, origin, path })
                    //         return false // if false we dont go deeper
                    //     }
                    // } else {
                    //     const value = origin_value
                    //     addMutation({ value, prop, destiny, origin, path })
                    //     return false // if false we dont go deeper
                    // }
                }
            },
            object
        )
        return { mutations, unpatch }
    }
}
