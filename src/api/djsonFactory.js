import { isFunction } from '../util/is'
import forEachObject from '../util/forEachObject'

export default function djsonFactory() {
    const types = {}
    const keys = []

    function stringifyAndParse(value, prop, object, is_valid, func, index = 0) {
        const key = keys[index]
        const type = types[key]

        // if (!types.hasOwnProperty(key)) {
        if (index >= keys.length) {
            return value
        }

        if (type[is_valid](value, prop, object)) {
            return type[func](value, prop, object)
        }

        return stringifyAndParse(value, prop, object, is_valid, func, index + 1)
    }

    function stringify(object, replacer) {
        runFunctionIfExists('beforeStringify', object)

        forEachObject(object, ({ origin, prop }) => {
            const value = stringifyAndParse(
                origin[prop],
                prop,
                origin,
                'isValidToStringify',
                'stringify'
            )
            console.log({ value })
            return isFunction(replacer)
                ? replacer.call(origin, prop, value)
                : value
        })

        runFunctionIfExists('afterStringify', object)
        return object
    }

    function parse(object, reviver) {
        runFunctionIfExists('beforeParse', object)
        forEachObject(object, ({ origin, prop }) => {
            const value = stringifyAndParse(
                origin[prop],
                prop,
                origin,
                'isValidToParse',
                'parse'
            )
            return isFunction(reviver)
                ? reviver.call(origin, prop, value)
                : value
        })
        runFunctionIfExists('afterParse', object)
        return object
    }

    function patch(value, prop, destiny, origin, path, index = 0) {
        const key = keys[index]
        const type = types[key]

        if (index >= keys.length) {
            const oldValue = destiny[prop]
            destiny[prop] = value
            return oldValue
        }

        if (
            type.isValidToPatch !== undefined &&
            type.isValidToPatch(value, prop, destiny, origin, path)
        ) {
            return type.patch(value, prop, destiny, origin)
        }

        return patch(value, prop, destiny, origin, path, index + 1)
    }

    function addType(factory) {
        const type = factory(api)
        if (types.hasOwnProperty(type.key))
            throw type.key + ' already added as type'
        types[type.key] = type
        keys.push(type.key)
        return type
    }

    function runFunctionIfExists(name, ...args) {
        keys.forEach(key => {
            if (isFunction(types[key][name])) {
                types[key][name](...args)
            }
        })
    }

    const api = { stringify, parse, patch, addType, types, keys }
    return api
}
