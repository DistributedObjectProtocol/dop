import { isPlainObject } from '../util/is'
import { getNewPlain } from '../util/get'
import { setDeep } from '../util/set'
import forEachObject from '../util/forEachObject'

export default function applyPatchFactory(patchFunction) {
    return function applyPatch(object, patch) {
        if (!isPlainObject(object) || !isPlainObject(patch)) {
            throw 'applyPatch only accepts plain objects'
        }

        const mutations = []
        const unpatch = {}

        function addMutation({ value, prop, destiny, origin, path }) {
            const oldValue = patchFunction(value, prop, destiny, origin, path)
            setDeep(unpatch, path.slice(0), oldValue)
            mutations.push({
                // value,
                oldValue,
                object: destiny,
                prop,
                path: path.slice(0)
            })
        }

        forEachObject(
            patch,
            ({ origin, destiny, prop, path }) => {
                const origin_value = origin[prop]
                const destiny_value = destiny[prop]
                if (
                    !destiny.hasOwnProperty(prop) ||
                    (origin_value !== destiny_value &&
                        !(
                            isPlainObject(origin_value) &&
                            isPlainObject(destiny_value)
                        ))
                ) {
                    const value = getNewPlain(origin_value)
                    addMutation({ value, prop, destiny, origin, path })
                    return false // if false we dont go deeper
                }
            },
            object
        )
        return { object, unpatch, mutations }
    }
}
