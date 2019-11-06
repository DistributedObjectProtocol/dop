import djsonFactory from '../util/djsonFactory'
import escapeFactory from '../types/Escape'
// import deleteFactory from '../types/Delete'
import undefinedFactory from '../types/Undefined'

// const Delete = deleteFactory()

const DJSON = djsonFactory({ skipParseProps: ['$escape'] })

const Escape = DJSON.setType(escapeFactory)

const Undefined = DJSON.setType(undefinedFactory)

export default DJSON
