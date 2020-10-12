import { isPlainObject, isArray } from '../src/util/is'
import forEachObject from '../src/util/forEachObject'

forEachObject(
    {
        first: { a: 1, b: 2 },
        second: { c: 3, d: [{ e: 4 }] },
    },
    {},
    ({ patch, target, prop, path }) => {
        target[prop] = {}
        if (!isPlainObject(patch[prop])) {
            console.log(path)
            return !isArray(patch[prop])
        }
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
