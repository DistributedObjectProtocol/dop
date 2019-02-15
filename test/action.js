var test = require('tape')
// require('tabe').createStream( test );
var dop = require('./.proxy').create()

test('basic collect', function(t) {
    var object = dop.register({
        a: true,
        b: true
    })
    var dopAction = dop.action(function(value) {
        dop.set(object, 'a', value)
        dop.set(object, 'b', value)
        return value
    })
    var observer = dop.createObserver(function(mutations) {
        t.equal(mutations.length, 2)
    })
    observer.observeObject(object)
    dopAction(false)
    t.end()
})

test('two actions', function(t) {
    var object = dop.register({
        a: true,
        b: true
    })
    var dopAction1 = dop.action(function(value) {
        dop.set(object, 'a', value)
        dop.set(object, 'b', value)
        return value
    })
    var dopAction2 = dop.action(function(value) {
        dop.set(object, 'a', value)
        dop.set(object, 'b', value)
        return value
    })
    var timesObserved = 0
    var observer = dop.createObserver(function(mutations) {
        timesObserved += 1
        t.equal(mutations.length, 2)
    })
    observer.observeObject(object)
    dopAction1(111)
    dopAction2(222)
    t.equal(timesObserved, 2)
    t.end()
})

test('same output', function(t) {
    var myAction = function(n) {
        return n
    }
    var dopAction = dop.action(myAction)
    var arg = 'argument1'
    t.equal(myAction(arg), arg)
    t.equal(myAction(arg), dopAction(arg))
    t.end()
})
