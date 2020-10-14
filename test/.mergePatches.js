import { isPlainObject, isArray } from '../src/util/is'
import { forEachDeep } from '../src/util/forEach'

function getPathId(path, id = '') {
    const prop = path[0]
    id += `${prop}.${prop}`
    return path.length - 1 > 0 ? getPathId(path.slice(1), id) : id
}

forEachDeep(
    {
        first: { a: 1, b: 2 },
        second: { c: 3, d: { array: [{ e: 4 }], str: 'hi' } },
    },
    ({ object, prop, path }) => {
        if (!isPlainObject(object[prop])) {
            console.log(path, object[prop])
            return !isArray(object[prop])
        }
        return true
    }
)

// function mergePatches(state, patches, resolver) {
//     const [patch1, patch2] = patches
// }

// const newpatch = mergePatches(
//     state,
//     [patch1, patch2],
//     ([mutation1, mutation2], oldv_alue, path, delta) => {
//         const { value, index } = mutation1
//         const { value, index } = mutation2
//         return mutation1.value
//     }
// )

// const tree = {
//     [delta_0]: {
//         [patch_id1]: {
//             replica_id,
//             patch,
//         },
//     },
//     [delta_1]: {
//         [patch_id1]: {
//             replica_id,
//             patch,
//         },
//     },
// }

// // node.js
// const crypto = require('crypto')
// function sha256(string) {
//     return crypto.createHash('sha256').update(string, 'utf8').digest('hex')
// }
// // browser
// async function sha256(string) {
//     const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
//     const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
//     const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
//     const hashHex = hashArray
//         .map((b) => b.toString(16).padStart(2, '0'))
//         .join('') // convert bytes to hex string
//     return hashHex
// }
