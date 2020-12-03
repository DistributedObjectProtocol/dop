import test from 'ava'
import { getDeep } from '../src/util/getset'

test('getDeep', function (t) {
    const object = { first: 1, second: { third: 4 } }

    t.is(getDeep(object, []), object)
    t.is(getDeep(object, ['']), undefined)
    t.is(getDeep(object, ['none']), undefined)
    t.is(getDeep(object, ['first']), object.first)
    t.is(getDeep(object, ['second']), object.second)
    t.is(getDeep(object, ['second', 'third']), object.second.third)
    t.is(getDeep(object, ['second', 'third', 'none']), undefined)
    t.is(getDeep(object, ['second', 'none']), undefined)
})
