import { isPlainObject } from '../util/is'
import { getNewPlain } from '../util/get'
import { setDeep } from '../util/set'
import forEachObject from '../util/forEachObject'

export default function applyPatchFactory(patchers) {
    return function applyPatch(object, patch) {
        if (!isPlainObject(object) || !isPlainObject(patch)) {
            throw 'applyPatch only accepts plain objects'
        }

        const mutations = []
        const unpatch = {}

        function addMutation({ oldValue, prop, origin, destiny, path }) {
            oldValue = patchers.reduce(
                (oldValue, patcher) =>
                    patcher({
                        value: destiny[prop],
                        origin,
                        prop,
                        destiny,
                        path,
                        oldValue
                    }),
                oldValue
            )
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
                    const oldValue = destiny[prop]
                    destiny[prop] = getNewPlain(origin_value)
                    addMutation({ prop, destiny, origin, path, oldValue })
                    return false // if false we dont go deeper
                }
            },
            object
        )
        return { object, unpatch, mutations }
    }
}
