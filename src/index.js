import merge from './api/merge'
import createDJSON from './api/djson'

const DJSON = createDJSON()

DJSON.setType('$delete', () => {
    const deletes = []
    return {
        isValidToStringify: value => value === undefined,
        isValidToParse: value => value.$delete === 0,
        stringify: value => ({ $delete: 0 }),
        parse: (value, prop, object) => {
            deletes.push({ prop, object })
            console.log(deletes)
            return value
        }
    }
})

const dop = { merge, DJSON, createDJSON }

export default dop
