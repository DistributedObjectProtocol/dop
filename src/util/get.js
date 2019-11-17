export function getUniqueKey(object, objectList) {
    let key_name
    for (const key in object) {
        if (!objectList.hasOwnProperty(key) || key_name !== undefined) {
            return
        }
        key_name = key
    }
    return key_name
}
