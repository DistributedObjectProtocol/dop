import createDJSON from '../util/createDJSON'

const DJSON = createDJSON()

DJSON.setType('$delete', () => {
    const undefineds = []
    return {
        isValidToStringify: value => value === undefined,
        isValidToParse: value => value.$delete === 0,
        stringify: value => ({ $delete: 0 }),
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
