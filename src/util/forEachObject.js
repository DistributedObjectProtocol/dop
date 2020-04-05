import { isObject } from './is'
import forEach from './forEach'

// https://jsperf.com/dop-foreachobject
// https://2ality.com/2019/10/shared-mutable-state.html
export default function forEachObject(patch, target, mutator) {
    forEachObjectLoop(patch, target, mutator, [])
}

function forEachObjectLoop(patch, target, mutator, path) {
    forEach(patch, (value_origin, prop) => {
        path.push(prop)
        const shallWeGoDown = mutator({ patch, target, prop, path })
        if (shallWeGoDown !== false && isObject(value_origin)) {
            forEachObjectLoop(value_origin, target[prop], mutator, path)
        }
        path.pop()
    })
}
