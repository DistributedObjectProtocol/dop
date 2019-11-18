import merge from './api/merge'
import applyPatch from './api/applyPatch'
import djsonFactory from './util/djsonFactory'
import { DJSON, Escape, Delete } from './api/djson'

const dop = {
    merge,
    applyPatch,
    djsonFactory,
    DJSON,
    Escape,
    Delete
}

export default dop
