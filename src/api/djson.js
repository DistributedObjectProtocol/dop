import { isPojoObject, isFunction } from '../util/is'

const TYPES = {
    $escape: {
        isValidToStringify: value => false,
        isValidToParse: value => true,
        stringify: value => ({ $escape: value }),
        parse: value => value
    },
    $delete: {
        isValidToStringify: value => value === undefined,
        isValidToParse: value => value === 0,
        stringify: value => ({ $delete: 0 }),
        parse: value => value
    }
}

function isValidToParse(object) {
    if (!isPojoObject(object)) return
    let type_name
    for (const key in object) {
        if (!TYPES.hasOwnProperty(key) || type_name !== undefined) {
            return
        }
        type_name = key
    }
    return TYPES[type_name].isValidToParse(object[type_name])
        ? type_name
        : undefined
}

function isValidToStringify(value) {
    for (const type_name in TYPES) {
        if (TYPES[type_name].isValidToStringify(value)) {
            return type_name
        }
    }
}

function stringify(object, replacer, space) {
    const escaped = new Map()
    return JSON.stringify(
        object,
        function(prop, value) {
            if (value !== object && !escaped.has(value)) {
                if (isValidToParse(value) !== undefined) {
                    escaped.set(value, true)
                    value = TYPES.$escape.stringify(value)
                }
                const type_name = isValidToStringify(value)
                if (type_name !== undefined) {
                    value = TYPES[type_name].stringify(value)
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
    return JSON.parse(text, function(prop, value) {
        const type_name = isValidToParse(value)
        if (type_name !== undefined) {
            value = TYPES[type_name].parse(value[type_name])
        }
        return isFunction(reviver) ? reviver.call(this, prop, value) : value
    })
}

const DJSON = { stringify, parse, TYPES }

export default DJSON
