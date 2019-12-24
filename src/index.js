import merge from './util/merge'
import converter from './util/converter'
import { isRemoteFunction } from './util/is'
import createNodeFactory from './api/createNodeFactory'
import createStoreFactory from './api/createStoreFactory'
import applyPatchFactory from './api/applyPatchFactory'
import Delete from './types/Delete'

function factory() {
    const TYPE = { Delete }
    const patchers = [Delete.patch]
    const encoders = [Delete.encode]
    const decoders = [Delete.decode]
    const encode = (object, list = encoders) => converter(object, list)
    const decode = (object, list = decoders) => converter(object, list)

    const applyPatch = applyPatchFactory(patchers)
    const createStore = createStoreFactory(applyPatch)
    const createNode = createNodeFactory({ encoders, decoders })

    return {
        factory,
        merge,
        encode,
        decode,
        applyPatch,
        createNode,
        createStore,
        TYPE,
        isRemoteFunction
    }
}

export default factory()
