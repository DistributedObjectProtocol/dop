import forEachObject from '../util/forEachObject'
import { mergeMutator } from '../util/merge'
import { isArray } from '../util/is'

export default function converter(origin, params, converters) {
    const destiny = isArray(origin) ? [] : {}
    forEachObject(origin, destiny, ({ origin, prop, destiny, path }) => {
        const value = converters.reduce(
            (value, converter) =>
                converter(
                    Object.assign(
                        {
                            value,
                            origin,
                            destiny,
                            prop,
                            path
                        },
                        params
                    )
                ),
            origin[prop]
        )
        if (origin[prop] !== value) {
            destiny[prop] = value
            return false // we don't go deeper
        } else {
            return mergeMutator({ origin, destiny, prop })
        }
    })
    return destiny
}
