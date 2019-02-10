var test = require('tape')
// require('tabe').createStream( test );
var dop = require('./.proxy').create()

test('observing root', function(t) {
    var object = dop.register({
        a: { a1: true },
        b: { b1: { b11: true } }
    })
    var observer = dop.createObserver(function(mutations) {
        t.equal(mutations.length, 1)
        t.end()
    })
    // observer.observeAll(object.b)
    observer.observeAll(object)
    dop.set(object.b.b1, 'b11', false)
})

test('mutation above', function(t) {
    var object = dop.register({
        a: true,
        b: { b1: { b11: true } }
    })
    var observer = dop.createObserver(function(mutations) {
        t.equal(true, false, 'This should not happen')
    })
    observer.observeAll(object.b)
    dop.set(object, 'a', false)
    t.equal(true, true, 'All good')
    t.end()
})

test('mutating both levels observing root', function(t) {
    var object = dop.register({
        a: true,
        b: { b1: { b11: true } }
    })
    var observer = dop.createObserver(function(mutations) {
        t.equal(mutations.length, 2)
        t.end()
    })
    observer.observeAll(object)
    dop.action(function() {
        dop.set(object, 'a', false)
        dop.set(object.b.b1, 'b11', false)
    })()
})

test('mutating both levels observing deep', function(t) {
    var object = dop.register({
        a: true,
        b: { b1: { b11: true } }
    })
    var observer = dop.createObserver(function(mutations) {
        t.equal(mutations.length, 1)
        t.end()
    })
    observer.observeAll(object.b.b1)
    dop.action(function() {
        dop.set(object, 'a', false)
        dop.set(object.b.b1, 'b11', false)
    })()
})
