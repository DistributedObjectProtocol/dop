import { isFunction } from './is'
import { getUniqueKey } from './get'

export default function djsonFactory() {
    const types = {}
    const keys = []

    function recursion(value, prop, object, isValid, func, index = 0) {
        const key = keys[index]
        const type = types[key]

        // if (!types.hasOwnProperty(key)) {
        if (index >= keys.length) {
            return value
        }

        if (type[isValid](value, prop, object)) {
            value = type[func](value, prop, object)
            return value
        }

        return recursion(value, prop, object, isValid, func, index + 1)
    }

    function stringify(object, replacer, space) {
        runFunctionIfExists('beforeStringify', object)

        const stringified = JSON.stringify(
            object,
            function(prop, value) {
                value = recursion(
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
            value = recursion(value, prop, this, 'isValidToParse', 'parse')
            return isFunction(reviver) ? reviver.call(this, prop, value) : value
        })

        runFunctionIfExists('afterParse', text, parsed)
        return parsed
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

    return { stringify, parse, addType }
}
