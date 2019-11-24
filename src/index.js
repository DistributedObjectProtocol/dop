import merge from './api/merge'
import applyPatchFactory from './api/applyPatchFactory'
import djsonFactory from './util/djsonFactory'
import { DJSON, Escape, Delete } from './api/djson'

const applyPatch = applyPatchFactory(DJSON)

const dop = {
    merge,
    applyPatch,
    djsonFactory,
    DJSON,
    Escape,
    Delete
}

export default dop
