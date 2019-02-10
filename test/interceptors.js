var test = require('tape')
// require('tabe').createStream( test );
dop = require('./.proxy').create()
var set = dop.set

var object = dop.register({ name: 'Enzo' })

test('Passing wrong arguments', function(t) {
    var disposer
    try {
        disposer = dop.intercept()
    } catch (e) {
        t.equal(
            e.message.indexOf('needs a registered object') > -1,
            true,
            e.message
        )
    }

    try {
        disposer = dop.intercept(object)
    } catch (e) {
        t.equal(e.message.indexOf('needs a callback') > -1, true, e.message)
    }

    try {
        disposer = dop.intercept(object, 'name')
    } catch (e) {
        t.equal(e.message.indexOf('needs a callback') > -1, true, e.message)
    }

    var disposer = dop.intercept(object, function() {})
    t.equal(typeof disposer, 'function')
    disposer()

    disposer = dop.intercept(object, 'name', function() {})
    t.equal(typeof disposer, 'function')
    disposer()

    t.end()
})

test('Multiple interceptors', function(t) {
    var inc = 1
    var disposer1 = dop.intercept(object, 'name', function(mutation) {
        t.equal(inc++, 2)
        return true
    })
    var disposer2 = dop.intercept(object, function(mutation) {
        t.equal(inc++, 1)
        return true
    })
    var disposer3 = dop.intercept(object, 'name', function(mutation) {
        t.equal(inc++, 3)
        return true
    })
    var observer = dop.createObserver(function(mutation) {
        disposer1()
        disposer2()
        disposer3()
        observer.destroy()
        t.equal(inc++, 4, 'observer')
        t.end()
    })
    observer.observeProperty(object, 'name')
    set(object, 'name', 'John')
})

test('Second interceptor do not return true', function(t) {
    var inc = 1
    var disposer1 = dop.intercept(object, function(mutation) {
        t.equal(inc++, 1)
        return true
    })
    var disposer2 = dop.intercept(object, 'name', function(mutation) {
        disposer1()
        disposer2()
        t.equal(inc++, 2)
        t.end()
    })
    var observer = dop.createObserver(function(mutation) {
        t.end(false, true, 'this shouldnt happen')
    })
    observer.observeProperty(object, 'name')
    set(object, 'name', 'Josema')
})
