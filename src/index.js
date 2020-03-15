import { version } from '../package.json'
import merge from './util/merge'
import converter from './util/converter'
import { isFunction } from './util/is'
import createNodeFactory from './api/createNodeFactory'
import createStoreFactory from './api/createStoreFactory'
import applyPatchFactory from './api/applyPatchFactory'
import Function from './types/Function'
import Array from './types/Array'
import Delete from './types/Delete'
import Replace from './types/Replace'
import Splice from './types/Splice'
import Inner from './types/Inner'

function factory() {
    const patchers = []
    const encoders = []
    const decoders = []
    const encode = (object, params = {}, list = encoders) =>
        converter(object, merge(params, { encode }), list)
    const decode = (object, params = {}, list = decoders) =>
        converter(object, merge(params, { decode }), list)
    const applyPatch = applyPatchFactory(patchers)
    const createStore = createStoreFactory(applyPatch)
    const createNode = createNodeFactory({ encode, decode })
    const addType = ({ patch, encode, decode }) => {
        if (isFunction(patch)) patchers.push(patch)
        if (isFunction(encode)) encoders.push(encode)
        if (isFunction(decode)) decoders.push(decode)
    }

    addType(Function)
    addType(Array)
    addType(Delete)
    addType(Replace)
    addType(Splice)
    addType(Inner)

    return {
        version,
        factory,
        merge,
        encode,
        decode,
        applyPatch,
        createNode,
        createStore,
        addType,
        TYPE: {
            Delete,
            Replace,
            Splice,
            Inner
        }
    }
}

export default factory()
