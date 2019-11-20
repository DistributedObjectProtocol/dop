export function setDeep(unpatch, path, value) {
    const prop = path.shift()
    if (path.length === 0) {
        unpatch[prop] = value
        return
    }
    return setDeep((unpatch[prop] = {}), path, value)
}
