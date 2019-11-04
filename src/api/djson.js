import createDJSON from '../util/createDJSON'

const escape = '$escape'

const DJSON = createDJSON({ skipParseProps: [escape] })

DJSON.setType(escape, ({ isValidToParse }) => {
    const escaped = new Map()
    return {
        isValidToStringify: (value, prop, object) => {
            if (!escaped.has(value)) {
                const type_name = isValidToParse(value, prop, object)
                if (type_name !== undefined) {
                    escaped.set(value, true)
                    return true
                }
            }
            return false
        },
        isValidToParse: () => true,
        stringify: value => ({ [escape]: value }),
        parse: value => value[escape]
    }
})

DJSON.setType('$delete', () => {
    const undefineds = []
    return {
        isValidToStringify: value => value === undefined,
        isValidToParse: (value, prop) => value.$delete === 0,
        stringify: () => ({ $delete: 0 }),
        parse: (value, prop, object) => {
            undefineds.push({ prop, object })
            return value
        },
        afterParse: parsed => {
            while (undefineds.length > 0) {
                const { object, prop } = undefineds.shift()
                object[prop] = undefined
            }
        }
    }
})

export default DJSON
