import merge from './util/merge'
import createStore from './api/createStore'
import applyPatchFactory from './api/applyPatchFactory'
import djsonFactory from './api/djsonFactory'
import escapeFactory from './types/Escape'
import deleteFactory from './types/Delete'
// import undefinedFactory from '../types/Undefined'

const DJSON = djsonFactory()
const Escape = DJSON.addType(escapeFactory)
const Delete = DJSON.addType(deleteFactory)
const applyPatch = applyPatchFactory(DJSON.patch)

const dop = {
    merge,
    createStore,
    applyPatch,
    djsonFactory,
    DJSON,
    Escape,
    Delete
}

export default dop
