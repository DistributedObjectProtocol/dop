import djsonFactory from '../util/djsonFactory'
import deleteFactory from '../types/Delete'
import undefinedFactory from '../types/Undefined'

const Delete = deleteFactory()
const Undefined = undefinedFactory()

const escape = '$escape'

const DJSON = djsonFactory({ skipParseProps: [escape] })

DJSON.setType(escape, ({ isValidToParse }) => {
    let escaped
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
        parse: value => value[escape],
        beforeStringify: () => (escaped = new Map())
    }
})

DJSON.setType(Undefined.key, () => Undefined)

export default DJSON
