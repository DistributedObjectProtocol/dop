var test = require('tape');
var dop = require('../dist/nodejs').create();



var object_id = 1
var object = dop.register({
    array: [[[]]],
    obj: {obj1:{obj2:{}}}
})


test('Object: defaults', function(t) {

    var path

    path = dop.getObjectPath(object)
    t.deepEqual(path,[object_id], JSON.stringify(path))

    path = dop.getObjectPath(object.obj)
    t.deepEqual(path,[object_id,"obj"], JSON.stringify(path))

    path = dop.getObjectPath(object.obj.obj1)
    t.deepEqual(path,[object_id,"obj","obj1"], JSON.stringify(path))

    path = dop.getObjectPath(object.obj.obj1.obj2)
    t.deepEqual(path,[object_id,"obj","obj1","obj2"], JSON.stringify(path))

    t.end()
});


test('Object: delete last', function(t) {

    var objectStored = object.obj.obj1.obj2
    delete object.obj.obj1.obj2

    var path

    path = dop.getObjectPath(object)
    t.deepEqual(path,[object_id], JSON.stringify(path))

    path = dop.getObjectPath(object.obj)
    t.deepEqual(path,[object_id,"obj"], JSON.stringify(path))

    path = dop.getObjectPath(object.obj.obj1)
    t.deepEqual(path,[object_id,"obj","obj1"], JSON.stringify(path))

    path = dop.getObjectPath(objectStored)
    t.deepEqual(path,undefined)

    t.end()
});


test('Object: delete first', function(t) {

    var objectStored = object.obj
    delete object.obj

    var path

    path = dop.getObjectPath(object)
    t.deepEqual(path,[object_id], JSON.stringify(path))

    path = dop.getObjectPath(objectStored)
    t.deepEqual(path,undefined)

    path = dop.getObjectPath(objectStored.obj1)
    t.deepEqual(path,undefined)

    t.end()
});



// test('Array: defaults', function(t) {

//     var path

//     path = dop.getObjectPath(object)
//     t.deepEqual(path,[object_id], JSON.stringify(path))

//     path = dop.getObjectPath(object.array)
//     t.deepEqual(path,[object_id,"array"], JSON.stringify(path))

//     path = dop.getObjectPath(object.array[0])
//     t.deepEqual(path,[object_id,"array",0], JSON.stringify(path))

//     path = dop.getObjectPath(object.array[0][0])
//     t.deepEqual(path,[object_id,"array",0,0], JSON.stringify(path))

//     t.end()
// });



// test('Array: unshift', function(t) {

//     object.array[0].unshift(null)
//     object.array.unshift(null)

//     var path
//     path = dop.getObjectPath(object)
//     t.deepEqual(path,[object_id], JSON.stringify(path))

//     path = dop.getObjectPath(object.array)
//     t.deepEqual(path,[object_id,"array"], JSON.stringify(path))

//     path = dop.getObjectPath(object.array[1])
//     t.deepEqual(path,[object_id,"array",1], JSON.stringify(path))

//     path = dop.getObjectPath(object.array[1][1])
//     t.deepEqual(path,[object_id,"array",1,1], JSON.stringify(path))

//     t.end()
// });




// test('Array: unshift 2', function(t) {

//     object.array.unshift(null)
//     object.array[2].unshift(null)

//     var path
//     path = dop.getObjectPath(object)
//     t.deepEqual(path,[object_id], JSON.stringify(path))

//     path = dop.getObjectPath(object.array)
//     t.deepEqual(path,[object_id,"array"], JSON.stringify(path))

//     path = dop.getObjectPath(object.array[2])
//     t.deepEqual(path,[object_id,"array",2], JSON.stringify(path))

//     path = dop.getObjectPath(object.array[2][2])
//     t.deepEqual(path,[object_id,"array",2,2], JSON.stringify(path))

//     t.end()
// });

// test('Array: removing array', function(t) {

//     // object.array.unshift(null)
//     var arrayStored = object.array[2][2]
//     object.array[2].splice(0,3)

//     var path
//     path = dop.getObjectPath(object.array[2])
//     t.deepEqual(path,[object_id,"array",2], JSON.stringify(path))

//     path = dop.getObjectPath(arrayStored)
//     t.deepEqual(path, undefined)

//     t.end()
// });


// test('Array: removing array 2', function(t) {


//     var path
//     path = dop.getObjectPath(object.array[2])
//     t.deepEqual(path,[object_id,"array",2], JSON.stringify(path))

//     dop.set(object.array[2],0,[])

//     path = dop.getObjectPath(object.array[2][0])
//     t.deepEqual(path,[object_id,"array",2,0], JSON.stringify(path))

//     var arrayStored = object.array[2][0]
//     object.array.splice(2,1)
//     path = dop.getObjectPath(arrayStored)
//     t.deepEqual(path, undefined)

//     t.end()
// });
