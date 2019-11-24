import { isFunction } from '../util/is'
import { getUniqueKey } from '../util/get'

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

    function stringify(object, replacer, space) {
        runFunctionIfExists('beforeStringify', object)

        const stringified = JSON.stringify(
            object,
            function(prop, value) {
                value = stringifyAndParse(
                    value,
                    prop,
                    this,
                    'isValidToStringify',
                    'stringify'
                )
                return isFunction(replacer)
                    ? replacer.call(this, prop, value)
                    : value
            },
            space
        )

        runFunctionIfExists('afterStringify', object, stringified)
        return stringified
    }

    function parse(text, reviver) {
        runFunctionIfExists('beforeParse', text)

        const parsed = JSON.parse(text, function(prop, value) {
            value = stringifyAndParse(
                value,
                prop,
                this,
                'isValidToParse',
                'parse'
            )
            return isFunction(reviver) ? reviver.call(this, prop, value) : value
        })

        runFunctionIfExists('afterParse', text, parsed)
        return parsed
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
        const type = factory({ types, getUniqueKey })
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

    return { stringify, parse, patch, addType }
}
