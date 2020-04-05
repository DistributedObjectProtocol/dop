import forEachObject from '../util/forEachObject'
import merge, { mergeMutator } from '../util/merge'
import { isArray } from '../util/is'

export default function converter(patch, params, converters) {
    const target = isArray(patch) ? [] : {}
    forEachObject(patch, target, ({ patch, prop, target, path }) => {
        const value = converters.reduce(
            (value, converter) =>
                converter(
                    merge(
                        {
                            value,
                            patch,
                            target,
                            prop,
                            path,
                        },
                        params
                    )
                ),
            patch[prop]
        )
        if (patch[prop] !== value) {
            target[prop] = value
            return false // we don't go deeper
        } else {
            return mergeMutator({ patch, target, prop })
        }
    })
    return target
}
