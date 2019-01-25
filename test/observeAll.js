var test = require('tape')
// require('tabe').createStream( test );
var dop = require('./.proxy').create()

test('observeAll', function(t) {
    var object = dop.register({
        a: { a1: true },
        b: { b1: { b11: true } }
    })
    var observer = dop.createObserver(function(mutations) {
        // t.equal(Array.isArray(mutations[0].swaps), true)
        // t.end()
    })
    observer.observeAll(object.b)
    observer.observeAll(object)
    object.b.b1.b11 = false
    t.end()
})
