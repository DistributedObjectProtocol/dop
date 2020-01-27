var test = require('tape')
var dop = require('./.proxy').create()
var set = dop.set
var del = dop.del

function getPatch(collector) {
    var patch = dop.core.getPatch(collector.mutations)
    var patchServer = dop.decode(dop.encode(patch))
    collector.destroy()
    for (var id in patchServer) return patchServer[id].chunks
}
function setPatch(destiny, chunks) {
    dop.core.setPatch(destiny, chunks, dop.core.setPatchMutator)
}
function makeTest(t, collector, objServer, objClient) {
    // console.log( JSON.stringify(objServer) );
    // console.log( JSON.stringify(objClient) );
    var patch = getPatch(collector)
    setPatch(objClient, patch)
    // console.log( JSON.stringify(objServer) );
    // console.log( JSON.stringify(objClient) );
}

var objServer = dop.register({
    number: 1,
    subobject: { value1: true },
    array: [{ value1: true }, 'B', 'C', 4],
    subobjectarray: { array: [{ value1: true }] }
})
var objClient = dop.register(dop.util.merge({}, objServer))

test('Same initial', function(t) {
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Splice 1', function(t) {
    var collector = dop.collect()
    objServer.array.splice(1, 1, 'Mola1')

    t.notDeepEqual(objServer, objClient)
    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Splice 2', function(t) {
    var collector = dop.collect()
    objServer.array.splice(0, 0, 'Mola2')

    t.notDeepEqual(objServer, objClient)
    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Splice 3', function(t) {
    var collector = dop.collect()
    objServer.array.splice(100, 100, 'Mola3')

    t.notDeepEqual(objServer, objClient)
    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Splice 4', function(t) {
    var collector = dop.collect()
    objServer.array.splice(1, 1, 'Mola4')

    t.notDeepEqual(objServer, objClient)
    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Splice 5', function(t) {
    var collector = dop.collect()
    objServer.array.splice(1, -100, 'Mola5')

    t.notDeepEqual(objServer, objClient)
    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Splice 6', function(t) {
    var collector = dop.collect()
    objServer.array.splice(-1, 2, 'Mola6')

    t.notDeepEqual(objServer, objClient)
    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Swap 1', function(t) {
    var collector = dop.collect()
    objServer.array.reverse()

    t.notDeepEqual(objServer, objClient)
    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objServer, objClient)
    t.end()
})

test('Deleting an subobject on destiny', function(t) {
    delete objClient.subobject
    t.notDeepEqual(objServer, objClient)

    var collector = dop.collect()
    set(objServer.subobject, 'value1', false)

    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objClient, objServer)
    t.end()
})

test('Deleting an array on destiny', function(t) {
    t.deepEqual(objClient, objServer)
    delete objClient.array
    t.notDeepEqual(objServer, objClient)

    var collector = dop.collect()
    set(objServer.array, 0, 'newValue')

    makeTest(t, collector, objServer, objClient)
    t.notDeepEqual(objClient.array, objServer.array)
    t.equal(objClient.array[0], objServer.array[0])
    t.end()
})

test('Deleting a subobject on destiny and deleting parent property on origin', function(t) {
    t.deepEqual(objClient.subobject, objServer.subobject)
    delete objClient.subobject

    var collector = dop.collect()
    del(objServer.subobject, 'value1')

    makeTest(t, collector, objServer, objClient)
    t.deepEqual(objClient.subobject, objServer.subobject)

    t.end()
})

test('Mutating array in server when objclient does not have that array', function(t) {
    delete objClient.array
    t.notDeepEqual(objServer, objClient)

    var collector = dop.collect()
    objServer.array.unshift({ value2: true })

    makeTest(t, collector, objServer, objClient)
    t.notEqual(objClient.array.length, objServer.array.length)
    t.deepEqual(objClient.array[0], objServer.array[0])
    t.end()
})
