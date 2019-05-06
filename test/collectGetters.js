var test = require('tape')
// require('tabe').createStream( test );
var dop = require('./.proxy').create()

var object = dop.register({ a: 1, b: 2, deep: { deep2: { c: 3 } } })

test('collectGetters', function(t) {
    var stopCollect = dop.collectGetters()
    dop.get(object, 'a')
    dop.get(object.deep.deep2, 'c')
    var stopCollect2 = dop.collectGetters()
    dop.get(object, 'b')
    var getters2 = stopCollect2()
    var getters = stopCollect()
    t.equal(getters.length, 4)
    t.equal(getters2.length, 1)
    var item = getters[0]
    t.equal(item.hasOwnProperty('object'), true, 'object')
    t.equal(item.hasOwnProperty('property'), true, 'property')
    // t.equal(item.hasOwnProperty('path'), true, 'path')
    t.end()
})
