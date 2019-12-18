import forEachObject from '../util/forEachObject'
import { mergeMutator } from '../util/merge'

export default function converter(object, converters) {
    const destiny = {}
    forEachObject(
        object,
        ({ origin, prop, destiny, path }) => {
            const value = converters.reduce(
                (value, converter) =>
                    converter({
                        value,
                        origin,
                        destiny,
                        prop,
                        path
                    }),
                origin[prop]
            )
            if (origin[prop] !== value) {
                destiny[prop] = value
                return false // we don't go deeper
            } else {
                return mergeMutator({ origin, destiny, prop })
            }
        },
        destiny
    )
    return destiny
}
