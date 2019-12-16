import forEachObject from '../util/forEachObject'

export default function converter(object, converters) {
    const destiny = {}
    forEachObject(
        object,
        ({ origin, prop, destiny, path }) => {
            return converters.reduce(
                (deeper, converter) =>
                    converter({
                        value: origin[prop],
                        origin,
                        prop,
                        destiny,
                        path,
                        deeper
                    }),
                true
            )
        },
        destiny
    )
    return destiny
}
