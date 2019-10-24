import { is } from './is'

// https://stackoverflow.com/questions/27433075/using-a-for-each-loop-on-an-empty-array-in-javascript
export default function forEach(object, callback) {
    if (is(object) == 'array') {
        for (let prop = 0; prop < object.length; ++prop) {
            callback(object[prop], prop)
        }
    } else {
        for (const prop in object) {
            callback(object[prop], prop)
        }
    }
}
