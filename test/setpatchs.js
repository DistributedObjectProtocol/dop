var test = require('tape');
var dop = require('./.proxy').create();
var set = dop.set
var del = dop.del


function getPatch(collector) {
    var patch = dop.core.getPatch(collector.mutations);
    var patchServer = dop.decode(dop.encode(patch));
    collector.destroy();
    for (var id in patchServer)
        return patchServer[id].chunks;
}
function setPatch(destiny, chunks) {
    dop.core.setPatch(
        destiny,
        chunks,
        dop.core.setPatchMutator
    );
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
    number:1,
    subobject:{value1:true},
    array:[{value1:true}],
    subobjectarray:{array:[{value1:true}]},
})
var objClient = dop.util.merge({}, objServer);




test('Same initial', function(t) {
    t.deepEqual(objServer, objClient)
    t.end()
})


test('Deleting an subobject on destiny', function(t) {
    delete objClient.subobject
    t.notDeepEqual(objServer, objClient)

    var collector = dop.collect()
    set(objServer.subobject, 'value1', false)

    makeTest(t, collector, objServer, objClient)
    t.equal(objClient.subobject, undefined)
    t.end()
})



test('Deleting an array on destiny', function(t) {
    delete objClient.array
    t.notDeepEqual(objServer, objClient)


    var collector = dop.collect()
    set(objServer.array[0], 'value1', false)
    
    makeTest(t, collector, objServer, objClient)
    t.equal(objClient.array, undefined)
    t.end()
})


test('Deleting a subobject on destiny and deleting parent property on origin', function(t) {
    delete objClient.subobject
    t.notDeepEqual(objServer, objClient)

    var collector = dop.collect()
    del(objServer.subobject, 'value1')

    makeTest(t, collector, objServer, objClient)
    t.equal(objClient.subobject, undefined)
    t.end()
})




test('Mutating array in server when objclient does not have that array', function(t) {
    delete objClient.array
    t.notDeepEqual(objServer, objClient)

    var collector = dop.collect()
    objServer.array.unshift({value2:true})

    makeTest(t, collector, objServer, objClient)
    t.equal(objClient.array, undefined)
    t.end()
})


test('Mutating deep array in server when objclient does not have that array', function(t) {
    delete objClient.subobjectarray
    t.notDeepEqual(objServer, objClient)

    var collector = dop.collect()
    objServer.subobjectarray.array.unshift({value2:true})

    makeTest(t, collector, objServer, objClient)
    t.equal(objClient.subobjectarray, undefined)
    t.end()
})