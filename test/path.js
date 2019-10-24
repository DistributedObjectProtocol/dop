import test from 'ava'
import { forEachObject } from '../'

// https://github.com/lodash/lodash/blob/master/test/merge.test.js
test.only('should merge `source` into `object`', function(t) {
    console.log('entra')
    const obj = {
        a: { ab: { abc: 3 } },
        b: { ba1: 1 }
    }

    forEachObject(obj, ({ path, prop }) => {
        console.log(path)
    })
    t.true(true)
})
