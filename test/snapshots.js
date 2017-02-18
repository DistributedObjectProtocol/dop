var test = require('tape');
var dop = require('../dist/nodejs').create();
var set = dop.set;
var del = dop.del;




function makeTest(t, snapshot, original, object, mutated) {
    
    var action = snapshot.getAction()
    var unaction = snapshot.getUnaction()
    var object_id = dop.getObjectId(object)
    action = action[object_id].action
    unaction = unaction[object_id].action
    var actionRemote = JSON.parse(JSON.stringify(action))
    var unactionRemote = JSON.parse(JSON.stringify(unaction))


    console.log('action',JSON.stringify(action))
    console.log('unaction',JSON.stringify(unaction))

    // Undo
    dop.core.setAction(object, unaction)
    t.deepEqual(object, original, 'undo local')
    // Redo
    dop.core.setAction(object, action)
    t.deepEqual(object, mutated, 'redo local')

    // Undo
    dop.core.setAction(object, unactionRemote)
    t.deepEqual(object, original, 'undo remote')
    // Redo
    dop.core.setAction(object, actionRemote)
    t.deepEqual(object, mutated, 'redo remote')


    t.end()
}


test('From string to array and mutations', function(t) {

    var object = dop.register({dos:[1,2,3]})
    var original = dop.util.merge({}, object)
    var collector = dop.collect()
    object.dos.splice(1,1) // {"dos":{"~DOP":[[1,1,1]],"length":2}}
    object.dos.reverse() // {"dos":{"~DOP":[[1,1,1],[0,0,1]],"length":2}}
    set(object, 'dos', [4,5,7]) // {"dos":[4,5,7]}
    object.dos.reverse()
    set(object, 'dos', '') //{"dos":""}
    var snapshot = collector.emitAndDestroy()
    var mutated = dop.util.merge({}, object)
    
    makeTest(t, snapshot, original, object, mutated) 
});

//        console.log(JSON.stringify(actions[object_id].action))




test('array to object', function(t) {

    var object = dop.register({array:[1,2,'3',4,5]})
    var original = dop.util.merge({}, object)
    var collector = dop.collect()
    object.array.reverse();   
    set(object, 'array', {caca:1})
    // object.array.reverse();   
    var snapshot = collector.emitAndDestroy()
    var mutated = dop.util.merge({}, object)
    
    makeTest(t, snapshot, original, object, mutated) 
});

test('object to array', function(t) {

    var object = dop.register({obj:{caca:1}})
    var original = dop.util.merge({}, object)
    var collector = dop.collect()
    set(object, 'obj', [1,2,'3',4,5])
    var snapshot = collector.emitAndDestroy()
    var mutated = dop.util.merge({}, object)
    
    makeTest(t, snapshot, original, object, mutated) 
});

// test('array mutation', function(t) {

//     var object = dop.register([{},"dos","tres","cuatro"])
//     var original = dop.util.merge([], object)
//     var collector = dop.collect()
//     set(object[0], 'prop', 'value')
//     object.reverse();   
//     var snapshot = collector.emitAndDestroy()
//     var mutated = dop.util.merge([], object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });

// test('array deep mutation', function(t) {

//     var object = dop.register([{p:[{p:[{}]}]},"dos"])
//     var original = dop.util.merge({}, object)
//     var collector = dop.collect()
//     set(object[0].p[0].p[0], 'prop', 'value')
//     // object.obj.reverse();   
//     var snapshot = collector.emitAndDestroy()
//     var mutated = dop.util.merge({}, object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });


// test('Bunch of mutations', function(t) {

//     var object = dop.register({dos:[1,2,3]})
//     var original = dop.util.merge({}, object)
//     var collector = dop.collect()
//     set(object, 'one', 11)
//     set(object.dos, 4, 'Changed Again');
//     object.dos.push({new:"Item"});
//     set(object.dos[5], 'Other', 'property');
//     object.dos.sort();
//     object.dos.pop();
//     set(object, 'tres', 3)
//     object.dos.push({new2:"Item2"});
//     set(object.dos[5], 'Other2', 'property2');
//     object.dos.reverse();   
//     set(object, 'dos', '')
//     var snapshot = collector.emitAndDestroy()
//     var mutated = dop.util.merge({}, object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });