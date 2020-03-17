import forEachObject from '../util/forEachObject'
import { is, isPlain } from '../util/is'

export function producePatch(object, fn) {
    const root = {}
    const mutations = []
    forEachObject(
        { draft: object },
        root,
        ({ origin, destiny, prop, path }) => {
            const origin_value = origin[prop]
            const destiny_value = destiny[prop]
            const tof_origin = is(origin_value)
            const tof_destiny = is(destiny_value)
            if (isPlain(origin_value)) {
                if (
                    !destiny.hasOwnProperty(prop) ||
                    tof_origin != tof_destiny
                ) {
                    const path_copy = path.slice(0)
                    destiny[prop] = new Proxy(tof_origin == 'array' ? [] : {}, {
                        set: (object, prop, value) => {
                            mutations(['set', path_copy, value])
                            object[prop] = value
                            return true
                        },
                        deleteProperty: (object, prop) => {
                            mutations(['delete', path_copy])
                            delete object[prop]
                            return true
                        }
                    })
                }
            } else {
                destiny[prop] = origin_value
                return false // we dont go deeper
            }
        }
    )
    fn(root.draft)
}
