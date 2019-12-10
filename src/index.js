import merge from './util/merge'
import createNodeFactory from './api/createNodeFactory'
import createStoreFactory from './api/createStoreFactory'
import applyPatchFactory from './api/applyPatchFactory'
import djsonFactory from './api/djsonFactory'
import escapeFactory from './types/Escape'
import deleteFactory from './types/Delete'
// import undefinedFactory from '../types/Undefined'

const DJSON = djsonFactory()
DJSON.Escape = DJSON.addType(escapeFactory)
DJSON.Delete = DJSON.addType(deleteFactory)

const applyPatch = applyPatchFactory(DJSON.patch)
const createNode = createNodeFactory(DJSON)
const createStore = createStoreFactory(applyPatch)

const dop = {
    merge,
    applyPatch,
    createNode,
    createStore,
    DJSON
}

export default dop
