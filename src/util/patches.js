import { setDeep, getDeep } from './getset.js'

export function createPatchFromMutations(mutations) {
    const patch = {}
    mutations.forEach((mutation) => setDeep(patch, mutation[0], mutation[1]))
    return patch
}

export function createPatchAndUnpatchFromMutations(mutations, object) {
    const patch = {}
    const unpatch = {}
    mutations.forEach(({ path, old_value }) => {
        setDeep(patch, path, getDeep(object, path))
        setDeep(unpatch, path, old_value)
    })
    return { patch, unpatch }
}
