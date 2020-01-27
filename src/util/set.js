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
    mutations.forEach(({ object, prop, path, oldValue }) => {
        setDeep(patch, path.slice(0), object[prop])
        setDeep(unpatch, path.slice(0), oldValue)
    })
    return { patch, unpatch }
}
