var test = require('tape')
// require('tabe').createStream( test );
var dop = require('./.proxy').create()

var object = dop.register({
    collector1: true,
    collector2: true,
    action1: true,
    action2: true
})

function collector1() {
    var collector = dop.collect()
    dop.set(object, 'collector1', !object.collector1)
    collector.emit()
}

function collector2() {
    var collector = dop.collect()
    collector1()
    dop.set(object, 'collector2', !object.collector2)
    collector.emit()
}

var action1 = dop.action(function() {
    dop.set(object, 'action1', !object.action1)
})

var action2 = dop.action(function() {
    action1()
    dop.set(object, 'action2', !object.action2)
})

var allInOne = dop.action(function() {
    action1()
    action2()
    collector1()
    collector2()
})

function allInOneCollector() {
    var collector = dop.collect()
    action1()
    action2()
    collector1()
    collector2()
    collector.emit()
}

test('Two collectors', function(t) {
    var times = 0
    var observer = dop.createObserver(function(m) {
        t.equal(m.length, 2)
        times += 1
    })
    observer.observeObject(object)
    collector2()
    t.equal(times, 1)
    observer.destroy()
    t.end()
})

test('Two actions', function(t) {
    var times = 0
    var observer = dop.createObserver(function(m) {
        t.equal(m.length, 2)
        times += 1
    })
    observer.observeObject(object)
    action2()
    t.equal(times, 1)
    observer.destroy()
    t.end()
})

test('allInOne as action', function(t) {
    var times = 0
    var observer = dop.createObserver(function(m) {
        t.equal(m.length, 6)
        times += 1
    })
    observer.observeObject(object)
    allInOne()
    t.equal(times, 1)
    observer.destroy()
    t.end()
})

test('allInOne as collector', function(t) {
    var times = 0
    var observer = dop.createObserver(function(m) {
        t.equal(m.length, 6)
        times += 1
    })
    observer.observeObject(object)
    allInOneCollector()
    t.equal(times, 1)
    observer.destroy()
    t.end()
})
