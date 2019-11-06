import djsonFactory from '../util/djsonFactory'
import escapeFactory from '../types/Escape'
import deleteFactory from '../types/Delete'
import undefinedFactory from '../types/Undefined'

const DJSON = djsonFactory({ skipParseProps: ['$escape'] })

const Escape = DJSON.addType(escapeFactory)
// const Delete = DJSON.addType(deleteFactory)
const Undefined = DJSON.addType(undefinedFactory)

export default DJSON
