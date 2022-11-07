import { isArray, isObject } from './is.js'

// https://stackoverflow.com/questions/27433075/using-a-for-each-loop-on-an-empty-array-in-javascript
export function forEach(object, callback) {
    if (isArray(object)) {
        for (let prop = 0; prop < object.length; ++prop) {
            callback(object[prop], prop)
        }
    } else {
        for (const prop in object) {
            callback(object[prop], prop)
        }
    }
}

export function forEachDeep(object, callback, path = []) {
    forEach(object, (value_origin, prop) => {
        path.push(prop)
        if (
            callback({ object, prop, path: path.slice(0) }) &&
            isObject(value_origin)
        ) {
            forEachDeep(value_origin, callback, path)
        }
        path.pop()
    })
}
