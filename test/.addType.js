import test from 'ava'
import { applyPatch, encode, decode, addType } from '../'
import Splice from '../src/types/Splice'
import { getNewPlain } from '../src/util/get'
import { isPlainObject } from '../src/util/is'

// Defining a type that push elements to an array
function Push(...elements) {
    if (!(this instanceof Push)) {
        return new Push(...elements)
    }
    this.elements = elements
}
Push.patch = function({ origin, destiny, prop, oldValue }) {
    const originValue = origin[prop]
    if (isArray(oldValue) && originValue instanceof Push) {
        destiny[prop] = oldValue
        return Push.apply(null, originValue.elements)
    }
    return oldValue
}
Push.encode = function({ value }) {
    if (value instanceof Push) {
        return { $push: value.elements }
    }
    return value
}
Push.decode = function({ value }) {
    if (getUniqueKey(value) === '$push' && isArray(value['$push'])) {
        return Push.apply(null, value['$push'])
    }
    return value
}

addType(Push)
