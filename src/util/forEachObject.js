import { isObject } from './is'
import forEach from './forEach'

// https://jsperf.com/dop-foreachobject
// https://2ality.com/2019/10/shared-mutable-state.html
export default function forEachObject(origin, destiny, mutator) {
    forEachObjectLoop(origin, destiny, mutator, [])
}

function forEachObjectLoop(origin, destiny, mutator, path) {
    forEach(origin, (value_origin, prop) => {
        path.push(prop)
        const shallWeGoDown = mutator({ origin, destiny, prop, path })
        if (shallWeGoDown !== false && isObject(value_origin)) {
            forEachObjectLoop(value_origin, destiny[prop], mutator, path)
        }
        path.pop()
    })
}
