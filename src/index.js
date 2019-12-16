import merge from './util/merge'
import converter from './util/converter'
import { isRemoteFunction } from './util/is'
import createNodeFactory from './api/createNodeFactory'
import createStoreFactory from './api/createStoreFactory'
import applyPatchFactory from './api/applyPatchFactory'
import Delete from './types/Delete'

function factory() {
    const TYPE = { Delete }
    const encode = (object, encoders = [Delete.encode]) =>
        converter(object, encoders)
    const decode = (object, decoders = [Delete.decode]) =>
        converter(object, decoders)

    const applyPatch = applyPatchFactory(TYPE.patch)
    const createNode = createNodeFactory(TYPE)
    const createStore = createStoreFactory(applyPatch)

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
