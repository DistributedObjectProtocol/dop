import { isPlainObject, isArray } from '../src/util/is'
import { forEachDeep } from '../src/util/forEach'

const getPathId = (path) => path.join('.') //path.map((prop) => prop + prop).join('.')

function getKeysCollision(object, key) {
    for (let k in object) {
        if (key.indexOf(k) === 0 || k.indexOf(key) === 0) {
            return k
        }
    }
}

function findConflicts(patchs) {
    const conflicts = {}
    patchs.forEach((patch, index) => {
        forEachDeep(patch, ({ object, prop, path }) => {
            const value = object[prop]
            if (!isPlainObject(value)) {
                const path_id = getPathId(path)
                const path_id_saved = getKeysCollision(conflicts, path_id)
                const path_values = { path, values: [{ value, index }] }
                if (path_id_saved === undefined) {
                    conflicts[path_id] = path_values
                } else {
                    console.log({ path_id_saved, path_id })
                    const path_length_saved =
                        conflicts[path_id_saved].path.length
                    if (path_length_saved === path.length) {
                        conflicts[path_id].values.push({ value, index })
                    } else if (path_length_saved < path.length) {
                        delete conflicts[path_id_saved]
                        conflicts[path_id] = path_values
                    }
                }
                return !isArray(value)
            }
            return true
        })
    })

    return conflicts
}

const patch1 = {
    first: { a: true, b: 1 },
    second: { c: 3, d: { array: [{ e: 4 }], str: 'hi' } },
}

const patch2 = {
    first: { a: true, b: 2 },
    second: { d: 'delete' },
}

const patch3 = {
    first: { b: 3 },
    second: { d: { array: { a: 1 } } },
}

const result = findConflicts([patch1, patch2, patch3])
console.log(result)

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
