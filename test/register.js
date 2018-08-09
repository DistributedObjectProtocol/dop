var test = require('tape')
// require('tabe').createStream( test );
var dop = require('./.proxy').create()
var objectTarget = { deep1: { deep2: {} } }
var object = dop.register(objectTarget)

test('Object root', function(t) {
    t.equal(dop.getObjectRoot(object), dop.getObjectProxy(object))
    t.equal(dop.getObjectRoot(object.deep1), dop.getObjectProxy(object))
    t.equal(dop.getObjectRoot(object.deep1.deep2), dop.getObjectProxy(object))
    t.end()
})

test('Object parent', function(t) {
    t.equal(dop.getObjectParent(object), undefined)
    t.equal(dop.getObjectParent(object.deep1), dop.getObjectProxy(object))
    t.equal(
        dop.getObjectParent(object.deep1.deep2),
        dop.getObjectProxy(object.deep1)
    )
    t.end()
})

test('Object property', function(t) {
    t.equal(dop.getObjectProperty(object), 1)
    t.equal(dop.getObjectProperty(object.deep1), 'deep1')
    t.equal(dop.getObjectProperty(object.deep1.deep2), 'deep2')
    t.end()
})

test('Object proxy and target', function(t) {
    t.equal(dop.getObjectProxy(object), object)
    t.equal(dop.getObjectProxy(objectTarget), object)
    t.equal(dop.getObjectTarget(object), objectTarget)
    t.equal(dop.getObjectTarget(objectTarget), objectTarget)
    t.end()
})

test('Correct configuration on deleted neested object', function(t) {
    var object = dop.register({
        subobject: {
            name: 'Josema',
            surname: 'Gonzalez'
        }
    })
    var copy = object.subobject
    dop.del(object, 'subobject')
    dop.set(copy, 'lol', { test: 1234 })
    t.equal(dop.getObjectRoot(copy.lol), object)
    t.equal(dop.getObjectPath(copy.lol), undefined)
    t.deepEqual(dop.getObjectPath(copy.lol, false), [2, 'subobject', 'lol'])
    dop.set(object, 'subobject', copy)
    t.deepEqual(dop.getObjectPath(copy.lol), [2, 'subobject', 'lol'])

    t.end()
})

test('register({})', function(t) {
    var o = dop.register({})
    t.equal(typeof o, 'object')
    t.end()
})

test('register(new Date)', function(t) {
    var o = dop.register(new Date())
    t.equal(typeof o, 'object')
    t.end()
})

test('register([])', function(t) {
    try {
        var o = dop.register([])
    } catch (e) {
        t.equal(typeof e, 'object')
        t.end()
    }
})

// var object = dop.register({
//     prop: "prop",
//     subobject:{ value:1, valua:2, subsubobject:{val:3}},
//     prearr: {arr: [{a:1},{b:2},{c:3,subarr:[{d:4}]}]}
// });

// test('Level', function(t) {
//     t.equal(object["~DOP"].l, 1);
//     t.equal(object.subobject["~DOP"].l, 2);
//     t.equal(object.subobject.subsubobject["~DOP"].l,3);
//     t.equal(object.prearr.arr[2].subarr[0]["~DOP"].l, 6);
//     t.end();
// })
// test('Level after editing', function(t) {
//     object.prop = {testing:{editing:{end:9999,arr:[{c:1}]}}}
//     t.equal(object.prop["~DOP"].l, 2);
//     t.equal(object.prop.testing.editing["~DOP"].l, 4);
//     t.equal(object.prop.testing.editing.arr[0]["~DOP"].l, 6);
//     t.equal(object["~DOP"].l, 1);
//     t.equal(object.subobject["~DOP"].l, 2);
//     t.equal(object.subobject.subsubobject["~DOP"].l,3);
//     t.equal(object.prearr.arr[2].subarr[0]["~DOP"].l, 6);
//     t.end();
// })

// test('Is inside of array', function(t) {
//     t.equal(object.prop["~DOP"].ia, false);
//     t.equal(object.prop.testing.editing["~DOP"].ia, false);
//     t.equal(object.prop.testing.editing.arr[0]["~DOP"].ia, true);
//     t.equal(object["~DOP"].ia, false);
//     t.equal(object.subobject["~DOP"].ia, false);
//     t.equal(object.prearr.arr[2].subarr[0]["~DOP"].ia, true);
//     t.end();

// dop.observe(object.subobject, function(){
//     console.log('changed', object.subobject.value)
// })

// copy = object.subobject
// object.subobject.value = 111
// object.subobject = {value:'new'}
// object.subobject.value = 222
// copy.value = 222

// })
