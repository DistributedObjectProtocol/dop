import merge from './util/merge'
import converter from './util/converter'
import { isFunction } from './util/is'
import createNodeFactory from './api/createNodeFactory'
import createStoreFactory from './api/createStoreFactory'
import applyPatchFactory from './api/applyPatchFactory'
import Delete from './types/Delete'
import Replace from './types/Replace'
// import Splice from './types/Splice'

function factory() {
    const TYPE = { Delete, Replace }
    const patchers = [Delete.patch, Replace.patch]
    const encoders = [Delete.encode, Replace.encode]
    const decoders = [Delete.decode, Replace.decode]
    const encode = (object, list = encoders) => converter(object, list)
    const decode = (object, list = decoders) => converter(object, list)
    const addType = ({ patch, encode, decode }) => {
        if (isFunction(patch)) patchers.push(patch)
        if (isFunction(encode)) encoders.push(encode)
        if (isFunction(decode)) decoders.push(decode)
    }

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
        addType,
        TYPE
    }
}

export default factory()
