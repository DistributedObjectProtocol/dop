import { isPojoObject, isFunction } from './is'

export default function djsonFactory({ skipParseProps = [] }) {
    const TYPES = {}

    function isValidToStringify(value, prop, object) {
        for (const type_name in TYPES) {
            const isValid = TYPES[type_name].isValidToStringify
            if (isFunction(isValid) && isValid(value, prop, object)) {
                return type_name
            }
        }
    }

    function isValidToParse(value, prop, object) {
        if (!isPojoObject(value)) {
            return
        }
        let type_name
        for (const key in value) {
            if (!TYPES.hasOwnProperty(key) || type_name !== undefined) {
                return
            }
            type_name = key
        }
        const isValid = TYPES[type_name].isValidToParse
        return isFunction(isValid) && isValid(value, prop, object)
            ? type_name
            : undefined
    }

    function stringify(object, replacer, space) {
        runFunctionIfExists('beforeStringify', object)

        const stringified = JSON.stringify(
            object,
            function(prop, value) {
                if (value !== object) {
                    const type_name = isValidToStringify(value, prop, this)
                    if (
                        type_name !== undefined &&
                        isFunction(TYPES[type_name].stringify)
                    ) {
                        value = TYPES[type_name].stringify(value, prop, this)
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
            if (!skipParseProps.includes(prop)) {
                const type_name = isValidToParse(value, prop, this)
                if (
                    type_name !== undefined &&
                    isFunction(TYPES[type_name].parse)
                ) {
                    value = TYPES[type_name].parse(value, prop, this)
                }
            }
            return isFunction(reviver) ? reviver.call(this, prop, value) : value
        })

        runFunctionIfExists('afterParse', text, parsed)

        return parsed
    }

    function setType(factory) {
        const type = factory({
            TYPES,
            parse,
            stringify,
            isValidToParse,
            isValidToStringify
        })
        TYPES[type.key] = type
        return type
    }

    function runFunctionIfExists(name, ...args) {
        for (const type_name in TYPES) {
            if (isFunction(TYPES[type_name][name])) {
                TYPES[type_name][name](...args)
            }
        }
    }

    return { stringify, parse, setType }
}
