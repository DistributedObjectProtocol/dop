import applyPatch from './api/applyPatch'
import merge from './api/merge'
import djsonFactory from './util/djsonFactory'
import { DJSON, Escape, Delete } from './api/djson'

const dop = {
    applyPatch,
    merge,
    djsonFactory,
    DJSON,
    Escape,
    Delete
}

export default dop
