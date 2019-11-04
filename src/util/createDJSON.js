import { isPojoObject, isFunction } from './is'

export default function createDJSON({ skipParseProps = [] }) {
    const TYPES = {}

    function isValidToStringify(value, prop, object) {
        for (const type_name in TYPES) {
            if (TYPES[type_name].isValidToStringify(value, prop, object)) {
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
        return TYPES[type_name].isValidToParse(value, prop, object)
            ? type_name
            : undefined
    }

    function stringify(object, replacer, space) {
        return JSON.stringify(
            object,
            function(prop, value) {
                if (value !== object) {
                    const type_name = isValidToStringify(value, prop, this)
                    if (type_name !== undefined) {
                        value = TYPES[type_name].stringify(value, prop, this)
                    }
                }

                return isFunction(replacer)
                    ? replacer.call(this, prop, value)
                    : value
            },
            space
        )
    }

    function parse(text, reviver) {
        const parsed = JSON.parse(text, function(prop, value) {
            if (!skipParseProps.includes(prop)) {
                const type_name = isValidToParse(value, prop, this)
                if (type_name !== undefined) {
                    value = TYPES[type_name].parse(value, prop, this)
                }
            }
            return isFunction(reviver) ? reviver.call(this, prop, value) : value
        })

        for (const type_name in TYPES) {
            if (typeof TYPES[type_name].afterParse == 'function') {
                TYPES[type_name].afterParse(parsed)
            }
        }

        return parsed
    }

    function setType(name, creator) {
        TYPES[name] = creator({
            TYPES,
            parse,
            stringify,
            isValidToParse,
            isValidToStringify
        })
    }

    return { stringify, parse, setType }
}
