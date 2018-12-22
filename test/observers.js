var test = require('tape')
// require('tabe').createStream( test );
var dop = require('./.proxy').create()

var object = dop.register({ uno: 'A', dos: 'B' })
var object2 = dop.register({ uno: 1, cuatro: 4 })
// dop.observe(object, myfun)
// object.uno = 25

test('createObserver.observe', function(t) {
    function first(mutations) {
        // console.log( mutations );
    }
    function second() {}

    var observer = dop.createObserver(first)
    var observer2 = dop.createObserver(first)
    var observer3 = dop.createObserver(second)
    t.equal(dop.data.observers[observer.id], observer2, 'Must be same object')
    t.equal(observer, observer2, 'observe and observe2 must be same observers')
    t.notEqual(
        observer,
        observer3,
        'observe and observe3 must be note same observers'
    )
    t.equal(Object.keys(dop.data.observers).length, 2, 'Only two observers ')

    observer.destroy()
    observer3.destroy()

    t.end()
})

test('mutations with createObserver', function(t) {
    var muta
    var observer = dop.createObserver(function first(mutations) {
        t.equal(
            mutations.length,
            2,
            'Two mutations received for the first observer'
        )
        muta = mutations
    })
    var observer2 = dop.createObserver(function second(mutations) {
        t.equal(
            mutations.length,
            1,
            'One mutations received for the second observer'
        )
        t.equal(
            mutations[0],
            muta[0],
            'The first mutation is the same object than the first observer'
        )
        t.end()
    })
    observer.observe(object)
    observer.observe(object, 'uno')
    observer2.observe(object, 'uno')

    collector = dop.collect()
    dop.set(object, 'uno', 123)
    dop.set(object, 'new', 123)
    collector.emit()
})

test('check swap mutation with createObserver', function(t) {
    var object = dop.register({ array: [1, 2, 3] })
    var observer = dop.createObserver(function first(mutations) {
        t.equal(Array.isArray(mutations[0].swaps), true)
        t.end()
    })
    observer.observe(object.array)
    object.array.reverse()
})
