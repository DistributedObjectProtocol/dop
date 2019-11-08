import { isPojoObject, isFunction } from './is'

export default function djsonFactory() {
    const types = {}
    const keys = []

    function isValidToStringify(value, prop, object) {
        for (const key in types) {
            const isValid = types[key].isValidToStringify
            if (isFunction(isValid) && isValid(value, prop, object)) {
                return key
            }
        }
    }

    function stringifyRecursive(value, prop, object, index = 0) {
        const key = keys[index]

        // if (!types.hasOwnProperty(key)) {
        if (index >= keys.length) {
            return value
        }

        if (
            isFunction(types[key].isValidToStringify) &&
            isFunction(types[key].stringify) &&
            types[key].isValidToStringify(value, prop, object)
        ) {
            value = types[key].stringify(value, prop, object)
        }

        return stringifyRecursive(value, prop, object, index + 1)
    }

    function isValidToParse(value, prop, object) {
        if (!isPojoObject(value)) {
            return
        }
        let key_name
        for (const key in value) {
            if (!types.hasOwnProperty(key) || key_name !== undefined) {
                return
            }
            key_name = key
        }
        const isValid = types[key_name].isValidToParse
        return isFunction(isValid) && isValid(value, prop, object)
            ? key_name
            : undefined
    }

    function stringify(object, replacer, space) {
        runFunctionIfExists('beforeStringify', object)

        const stringified = JSON.stringify(
            object,
            function(prop, value) {
                if (value !== object) {
                    if (
                        !keys.some(
                            key =>
                                isFunction(types[key].skipStringify) &&
                                types[key].skipStringify(value, prop, this)
                        )
                    ) {
                        value = stringifyRecursive(value, prop, this)
                    }
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
            const key_name = isValidToParse(value, prop, this)
            if (
                key_name !== undefined &&
                isFunction(types[key_name].parse) &&
                !keys.some(
                    key =>
                        isFunction(types[key].skipParse) &&
                        types[key].skipParse(value, prop, this)
                )
            ) {
                value = types[key_name].parse(value, prop, this)
            }

            return isFunction(reviver) ? reviver.call(this, prop, value) : value
        })

        runFunctionIfExists('afterParse', text, parsed)

        return parsed
    }

    function addType(factory) {
        const type = factory({
            types,
            parse,
            stringify,
            isValidToParse,
            isValidToStringify
        })
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
