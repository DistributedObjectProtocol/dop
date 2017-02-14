var test = require('tape');
var dop = require('../dist/nodejs').create();
var set = dop.set;
var del = dop.del;




function makeTest(t, snapshot, original, object, mutated) {
    
    var action = snapshot.getAction()
    var unaction = snapshot.getUnaction()
    var unactionRemote = {}
    var actionRemote = {}
    for (var i in unaction) {
        unactionRemote[i] = {object:unaction[i].object, action:JSON.parse(JSON.stringify(unaction[i].action))}
        actionRemote[i] = {object:action[i].object, action:JSON.parse(JSON.stringify(action[i].action))}
    }


    // if (action[1]){
    //     console.log('unaction',JSON.stringify(unaction[1].action), typeof unaction[1].action.dos["~DOP"])
    //     console.log('action',JSON.stringify(action[1].action))
    // }

    // Undo
    dop.core.setAction(unaction).destroy() // snapshot.undo().destroy()
    t.deepEqual(object, original, 'undo local')
    // Redo
    dop.core.setAction(action).destroy() // snapshot.redo().destroy()
    t.deepEqual(object, mutated, 'redo local')

    // Undo
    dop.core.setAction(unactionRemote).destroy() // snapshot.undo().destroy()
    t.deepEqual(object, original, 'undo remote')
    // Redo
    dop.core.setAction(actionRemote).destroy() // snapshot.redo().destroy()
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




// test('array to object', function(t) {

//     var object = dop.register({array:[1,2,'3',4,5]})
//     var original = dop.util.merge({}, object)
//     var collector = dop.collect()
//     // object.array.reverse();   
//     set(object, 'array', {caca:1})
//     // object.array.reverse();   
//     var snapshot = collector.emitAndDestroy()
//     var mutated = dop.util.merge({}, object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });

// test('object to array', function(t) {

//     var object = dop.register({obj:{caca:1}})
//     var original = dop.util.merge({}, object)
//     var collector = dop.collect()
//     set(object, 'obj', [1,2,'3',4,5])
//     var snapshot = collector.emitAndDestroy()
//     var mutated = dop.util.merge({}, object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });

// test('array mutation', function(t) {

//     var object = dop.register([{},"dos"])
//     var original = dop.util.merge({}, object)
//     var collector = dop.collect()
//     set(object[0], 'prop', 'value')
//     // object.obj.reverse();   
//     var snapshot = collector.emitAndDestroy()
//     var mutated = dop.util.merge({}, object)
    
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
//     set(object.array, 4, 'Changed Again');
//     object.array.push({new:"Item"});
//     set(object.array[5], 'Other', 'property');
//     object.array.sort();
//     object.array.pop();
//     set(object, 'tres', 3)
//     object.array.push({new2:"Item2"});
//     set(object.array[5], 'Other2', 'property2');
//     object.array.reverse();
//     object.dos.reverse();   
//     set(object, 'dos', '')
//     var snapshot = collector.emitAndDestroy()
//     var mutated = dop.util.merge({}, object)
    
//     makeTest(t, snapshot, original, object, mutated) 
// });