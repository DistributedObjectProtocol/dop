export function setDeep(unpatch, path, value) {
    const prop = path.shift()
    if (path.length === 0) {
        unpatch[prop] = value
        return
    }
    if (!unpatch.hasOwnProperty(prop)) {
        unpatch[prop] = {}
    }
    return setDeep(unpatch[prop], path, value)
}

export function createPatchFromMutations(mutations) {
    const patch = {}
    const unpatch = {}
    mutations.forEach(({ object, prop, path, old_value }) => {
        setDeep(patch, path.slice(0), object[prop])
        setDeep(unpatch, path.slice(0), old_value)
    })
    return { patch, unpatch }
}
