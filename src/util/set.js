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
