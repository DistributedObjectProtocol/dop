// import { version } from '../package.json.js'
import { isFunction } from './util/is.js'
import { merge, converter } from './util/merge.js'
import { producePatch } from './util/patches.js'

import createNodeFactory from './api/createNodeFactory.js'
import createStoreFactory from './api/createStoreFactory.js'
import applyPatchFactory from './api/applyPatchFactory.js'

import Primitives from './types/Primitives.js'
import Rpc from './types/Rpc.js'
import Delete from './types/Delete.js'
import Replace from './types/Replace.js'
import Splice from './types/Splice.js'
import Swap from './types/Swap.js'
import Multi from './types/Multi.js'

// Deno does not support json imports: https://stackoverflow.com/questions/61907155/deno-import-json-file-as-module
const version = '1.5.4'

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

    addType(Primitives)
    addType(Rpc)
    addType(Delete)
    addType(Replace)
    addType(Splice)
    addType(Swap)
    addType(Multi)

    return {
        version,
        factory,
        merge,
        encode,
        decode,
        producePatch,
        applyPatch,
        createNode,
        createStore,
        addType,
        TYPE: {
            Delete,
            Replace,
            Splice,
            Swap,
            Multi,
        },
    }
}

const dop = factory()
const { encode, decode, applyPatch, createNode, createStore, addType, TYPE } =
    dop

export default dop
export {
    version,
    factory,
    merge,
    encode,
    decode,
    producePatch,
    applyPatch,
    createNode,
    createStore,
    addType,
    TYPE,
}
