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
                const key_name = isValidToStringify(value, prop, this)
                if (
                    value !== object &&
                    key_name !== undefined &&
                    isFunction(types[key_name].stringify) &&
                    !keys.some(
                        key =>
                            isFunction(types[key].skipStringify) &&
                            types[key].skipStringify(value, prop, this)
                    )
                ) {
                    value = types[key_name].stringify(value, prop, this)
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
        keys.push(type.key)
        types[type.key] = type
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
