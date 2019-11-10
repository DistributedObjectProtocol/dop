import { isFunction } from './is'

export default function djsonFactory() {
    const types = {}
    const keys = []

    function stringifyRecursive(value, prop, object, index = 0) {
        const key = keys[index]

        // if (!types.hasOwnProperty(key)) {
        if (index >= keys.length) {
            return value
        }

        if (isFunction(types[key].stringify)) {
            value = types[key].stringify(value, prop, object)
        }

        return stringifyRecursive(value, prop, object, index + 1)
    }

    function parseRecursive(value, prop, object, index = 0) {
        const key = keys[index]

        if (index >= keys.length) {
            return value
        }

        if (isFunction(types[key].parse)) {
            value = types[key].parse(value, prop, object)
        }

        return parseRecursive(value, prop, object, index + 1)
    }

    function stringify(object, replacer, space) {
        runFunctionIfExists('beforeStringify', object)

        const stringified = JSON.stringify(
            object,
            function(prop, value) {
                if (
                    !keys.some(
                        key =>
                            isFunction(types[key].skipStringify) &&
                            types[key].skipStringify(value, prop, this)
                    )
                ) {
                    value = stringifyRecursive(value, prop, this)
                }

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
            if (
                !keys.some(
                    key =>
                        isFunction(types[key].skipParse) &&
                        types[key].skipParse(value, prop, this)
                )
            ) {
                value = parseRecursive(value, prop, this)
            }

            return isFunction(reviver) ? reviver.call(this, prop, value) : value
        })

        runFunctionIfExists('afterParse', text, parsed)

        return parsed
    }

    function addType(factory) {
        const type = factory({ types })
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
