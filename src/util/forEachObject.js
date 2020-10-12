import { isObject } from './is'
import forEach from './forEach'

// https://jsperf.com/dop-foreachobject
// https://2ality.com/2019/10/shared-mutable-state.html
export default function forEachObject(patch, target, mutator, path = []) {
    forEach(patch, (value_origin, prop) => {
        path.push(prop)
        const shallWeGoDown = mutator({ patch, target, prop, path })
        if (shallWeGoDown !== false && isObject(value_origin)) {
            forEachObject(value_origin, target[prop], mutator, path)
        }
        path.pop()
    })
}

// export default function forEachObject(patch, target, mutator) {
//     forEachObjectBase(patch, ({ object, prop, path }) => {
//         mutator({ patch: object, target, prop, path })
//     })
// }

// function forEachObjectBase(object, callback, path = []) {
//     forEach(object, (value_origin, prop) => {
//         path.push(prop)
//         callback({ object, prop, path })
//         if (isObject(value_origin)) {
//             forEachObjectBase(value_origin, callback, path)
//         }
//         path.pop()
//     })
// }
