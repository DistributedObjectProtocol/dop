var test = require('tape')
var dopClient = require('./.proxy').create()
var dopServer = require('./.proxy').create()

function getPatch(collector) {
    var patch = dopServer.core.getPatch(collector.mutations)
    var patchServer = dopServer.decode(dopServer.encode(patch))
    collector.destroy()
    for (var id in patchServer) return patchServer[id].chunks
}
function setPatch(destiny, chunks) {
    dopClient.core.setPatch(destiny, chunks, dopClient.core.setPatchMutator)
}

test('Creating a new property with a new object must generate only one mutation in client', function(t) {
    var objServer = dopServer.register({})
    var objClient = dopClient.register({})
    var collectorServer = dopServer.collect()
    dopServer.set(objServer, 'prop', { new: 'object' })

    var collectorClient = dopClient.collect()
    setPatch(objClient, getPatch(collectorServer))

    t.equal(collectorClient.mutations.length, 1)
    t.deepEqual(objServer, objClient)
    collectorClient.destroy()
    t.end()
})
