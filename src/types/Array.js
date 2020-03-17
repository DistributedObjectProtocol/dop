import { isArray } from '../util/is'
import merge from '../util/merge'

export default function Array() {}

Array.patch = function({ origin, destiny, prop, old_value }) {
    const origin_value = origin[prop]
    if (isArray(origin_value)) {
        destiny[prop] = merge([], origin_value)
    }
    return old_value
}
