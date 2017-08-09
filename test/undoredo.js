var test = require('tape');
var dop = require('./.proxy').create();
var set = dop.set;
var del = dop.del;




function makeTest(t, snapshot, original, object, mutated) {

    var patch, unpatch;
    var object_id = dop.getObjectId(object)
    var target = dop.getObjectTarget(object)

    unpatch = dop.decode(dop.encode(snapshot.getUnpatch()[object_id].chunks))
    // console.log('UNDO', unpatch.length, JSON.stringify(unpatch))
    patch = dop.decode(dop.encode(snapshot.getPatch()[object_id].chunks))
    // console.log('REDO', patch.length, JSON.stringify(patch))

    // Undo
    snapshot.undo()
    t.deepEqual(target, original, 'undo 1')
   
    // Redo
    snapshot.redo()
    t.deepEqual(target, mutated, 'redo 1')

    // Undo
    snapshot.undo()
    snapshot.undo()
    t.deepEqual(target, original, 'undo 2')
   
    // Redo
    snapshot.redo()
    snapshot.redo()
    t.deepEqual(target, mutated, 'redo 2')

    t.end()
}






//todo
// set
// setarray length
// del
// newprop
// reverse
// splice
// sortby




test('Set array', function(t) {

    var object = dop.register({dos:{a:1,b:2,c:3}})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object, 'dos', {e:4})
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});


test('Reverse', function(t) {

    var object = dop.register({dos:["A","B","C"]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    object.dos.reverse();   
    set(object, 'dos', [1,2,3])
    object.dos.reverse();   
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});


test('set length array', function(t) {

    var object = dop.register({array:[1,2,'3',4,5]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object.array, '10', 'text')
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)

    makeTest(t, snapshot, original, object, mutated) 
});



test('set a random property in an array', function(t) {

    var object = dop.register({array:[1,2,'3',4,5]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object, 'hello', 'world')
    set(object.array, 'hello', 'world')
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)

    makeTest(t, snapshot, original, object, mutated) 
});



test('set length sub array', function(t) {

    var object = dop.register({array:[1,2,'3',4,5]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object, 'array', {caca:1})
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)  

    makeTest(t, snapshot, original, object, mutated) 
})



test('array to object', function(t) {

    var object = dop.register({array:[1,2,'3',4,5]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    object.array.reverse();   
    object.array.sort();   
    set(object, 'array', {caca:1})
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});

test('object to array', function(t) {

    var object = dop.register({obj:{caca:1}})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object, 'obj', [1,2,'3',4,5])
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});

test('array two mutation', function(t) {

    var object = dop.register({array:[{},"dos","tres","cuatro",{five:"five"}]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object.array[0], 'prop', 'value')
    set(object.array, 4, 'five')
    object.array.reverse();   
    object.array.sort();   
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    makeTest(t, snapshot, original, object, mutated) 
});

test('array deep mutation', function(t) {

    var object = dop.register({array:[{p:[{p:[{}]}]},"dos"]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object.array[0].p[0].p[0], 'prop', 'value')
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});


test('Bunch of mutations', function(t) {

    var object = dop.register({dos:[1,2,3]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    set(object, 'one', 11)
    set(object.dos, 4, 'Changed Again');
    object.dos.push({new:"Item"});
    set(object.dos[5], 'Other', 'property');
    object.dos.sort();
    object.dos.pop();
    set(object, 'tres', 3)
    object.dos.push({new2:"Item2"});
    set(object.dos[5], 'Other2', 'property2');
    object.dos.reverse();   
    // set(object, 'dos', '')
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});


test('From string to array and mutations', function(t) {

    var object = dop.register({dos:[1,2,3]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    object.dos.splice(1,1) 
    set(object, 'new', 'n') 
    object.dos.reverse()
    set(object, 'dos', [4,5,7])
    object.dos.reverse()
    del(object, 'dos') //{"dos":""}
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});




test('Negative splice', function(t) {

    var object = dop.register({dos:[1,2,3]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    object.dos.splice(1,-1,'!') 
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});
