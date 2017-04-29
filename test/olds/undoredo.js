var test = require('tape');
var dop = require('../dist/nodejs').create();
var set = dop.set;
var del = dop.del;




function makeTest(t, snapshot, original, object, mutated) {
    
    var patch, unpatch;
    var object_id = dop.getObjectId(object)
    var target = dop.getObjectTarget(object)

    // Redo
    patch = dop.decode(dop.encode(dop.core.getPatch(snapshot.mutations)[object_id].patch))

    // Undo
    snapshot.undo()
    unpatch = dop.decode(dop.encode(dop.core.getPatch(snapshot.mutations)[object_id].patch))
    t.deepEqual(target, original, 'undo local')
    if (Array.isArray(target))
        t.equal(target.length, original.length, 'undo length local')
   
    // Redo
    snapshot.redo()
    // t.deepEqual(target, mutated, 'redo local')
    // if (Array.isArray(target))
    //     t.equal(target.length, mutated.length, 'redo length local')





    // Undo
    // console.log('UNDO', dop.encode(unpatch))
    // dop.core.setPatch(object, unpatch)
    // t.deepEqual(target, original, 'undo remote')
    // if (Array.isArray(target))
    //     t.equal(target.length, original.length, 'undo length remote')


    // Redo
    console.log('REDO', dop.encode(patch))
    // dop.core.setPatch(object, patch)
    // t.deepEqual(target, mutated, 'redo remote')
    // if (Array.isArray(target))
    //     t.equal(target.length, mutated.length, 'redo length remote')


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


// test('Reverse', function(t) {

//     var object = dop.register({dos:["A","B","C"]})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     object.dos.reverse();   
//     set(object, 'dos', [1,2,3])
//     object.dos.reverse();   
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });


// test('set length array', function(t) {

//     var object = dop.register({array:[1,2,'3',4,5]})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     set(object.array, '10', 'text')
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)

//     makeTest(t, snapshot, original, object, mutated) 
// });

// // test('set a random property in an array', function(t) {

// //     var object = dop.register([1,2,'3',4,5])
// //     var original = dop.util.clone(object)
// //     var collector = dop.collect()
// //     set(object, 'hello', 'text')
// //     var snapshot = collector.emit()
// //     var mutated = dop.util.clone(object)

// //     makeTest(t, snapshot, original, object, mutated) 
// // });

// test('set length sub array', function(t) {

//     var object = dop.register({array:[1,2,'3',4,5]})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     set(object, 'array', {caca:1})
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)  

//     makeTest(t, snapshot, original, object, mutated) 
// })



// test('array to object', function(t) {

//     var object = dop.register({array:[1,2,'3',4,5]})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     object.array.reverse();   
//     object.array.sort();   
//     set(object, 'array', {caca:1})
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });

// test('object to array', function(t) {

//     var object = dop.register({obj:{caca:1}})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     set(object, 'obj', [1,2,'3',4,5])
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });

// test('array mutation', function(t) {

//     var object = dop.register({array:[{},"dos","tres","cuatro"]})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     set(object.array[0], 'prop', 'value')
//     object.array.reverse();   
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)
//     makeTest(t, snapshot, original, object, mutated) 
// });

// test('array deep mutation', function(t) {

//     var object = dop.register({array:[{p:[{p:[{}]}]},"dos"]})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     set(object.array[0].p[0].p[0], 'prop', 'value')
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });


test('Bunch of mutations', function(t) {

    var object = dop.register({dos:[1,2,3]})
    var original = dop.util.clone(object)
    var collector = dop.collect()
    // set(object, 'one', 11)
    set(object.dos, 4, 'Changed Again');
    // object.dos.push({new:"Item"});
    // set(object.dos[5], 'Other', 'property');
    // object.dos.sort();
    // object.dos.pop();
    // set(object, 'tres', 3)
    // object.dos.push({new2:"Item2"});
    // set(object.dos[5], 'Other2', 'property2');
    // object.dos.reverse();   
    set(object, 'dos', '')
    var snapshot = collector.emit()
    var mutated = dop.util.clone(object)
    
    makeTest(t, snapshot, original, object, mutated) 
});


// test('From string to array and mutations', function(t) {

//     var object = dop.register({dos:[1,2,3]})
//     var original = dop.util.clone(object)
//     var collector = dop.collect()
//     object.dos.splice(1,1) // {"dos":{"~DOP":[[1,1,1]],"length":2}}
//     set(object, 'new', 'n') // {"dos":[4,5,7]}
//     object.dos.reverse() // {"dos":{"~DOP":[[1,1,1],[0,0,1]],"length":2}}
//     set(object, 'dos', [4,5,7]) // {"dos":[4,5,7]}
//     object.dos.reverse()
//     del(object, 'dos') //{"dos":""}
//     var snapshot = collector.emit()
//     var mutated = dop.util.clone(object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });
