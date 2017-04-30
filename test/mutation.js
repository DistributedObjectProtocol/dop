var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs').create();
var dopClient = dop.create();
var dopClientTwo = dop.create();
var set = dop.set;
var del = dop.del;


var object = dop.register({deep1:{deep2:{}}});
var array = dop.register({array:[1,2,3]});

test('Object.set', function(t) {
    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1], '.path')
    }
    dop.observe(object, fun)
    set(object, 'newprop', '12345')
    dop.unobserve(object, fun)


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    dop.observe(object.deep1, fun)
    set(object.deep1, 'newprop', '12345')
    dop.unobserve(object.deep1, fun)
    

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1','deep2'], '.path')
    }
    dop.observe(object.deep1.deep2, fun)
    set(object.deep1.deep2, 'newprop', '12345')
    dop.unobserve(object.deep1.deep2, fun)
    
    
    t.end();
});



test('Object.del', function(t) {
    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, undefined, '.value')
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.deepEqual(mutation.path, [1], '.path')
    }
    dop.observe(object, fun)
    del(object, 'newprop')
    dop.unobserve(object, fun)


    // fun = function(mutations) {
    //     var mutation = mutations[0]
    //     t.equal(mutation.object, object.deep1, '.object')
    //     t.equal(mutation.oldValue, '12345', '.oldValue')
    //     t.equal(mutation.prop, 'newprop', '.prop')
    //     t.equal(mutation.value, undefined, '.value')
    //     t.deepEqual(mutation.path, [1,'deep1'], '.path')
    // }
    // dop.observe(object.deep1, fun)
    // del(object.deep1, 'newprop')
    // dop.unobserve(object.deep1, fun)
    

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, undefined, '.value')
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1','deep2'], '.path')
    }
    dop.observe(object.deep1.deep2, fun)
    del(object.deep1.deep2, 'newprop')
    dop.unobserve(object.deep1.deep2, fun)
    
    
    t.end();
});

test('Object.del change value', function(t) {
    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '67890', '.value')
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    dop.observe(object.deep1, fun)
    set(object.deep1, 'newprop', '67890')
    dop.unobserve(object.deep1, fun)

    t.end();
});



test('Object.del subobject', function(t) {
    var deep2 = object.deep1.deep2

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.prop, 'deep2', '.prop')
        t.deepEqual(mutation.value, {}, '.value')
        t.deepEqual(mutation.oldValue, dop.util.clone(deep2), '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    dop.observe(object.deep1, fun)
    set(object.deep1, 'deep2', {})
    dop.unobserve(object.deep1, fun)


    fun = function(mutations) {
        t.equal(true, false, "This mutation shouldn't be observed because deep2 is not inside of object anymore")
    }
    dop.observe(deep2, fun)
    set(deep2, 'deep3', {deeper:true})
    dop.unobserve(deep2, fun)



    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.prop, 'deep3', '.prop')
        t.deepEqual(mutation.value, 'hola mundo', '.value')
        t.deepEqual(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1','deep2'], '.path')
    }
    dop.observe(object.deep1.deep2, fun)
    set(object.deep1.deep2, 'deep3', 'hola mundo')
    dop.unobserve(object.deep1.deep2, fun)

    t.end();
});




test('Array.set', function(t) {
    var first = true;
    fun = function(mutations) {
        var mutation = mutations[0]
        if (first) {
            t.equal(mutation.object, array.array, '.object')
            t.equal(mutation.prop, 'length', '.prop')
            t.deepEqual(mutation.value, 6, '.value')
            t.equal(mutation.oldValue, 3, '.oldValue')
            t.deepEqual(mutation.path, [2,'array'], '.path')
            first = false
        }
        else {
            t.equal(mutation.object, array.array, '.object')
            t.equal(mutation.prop, 5, '.prop')
            t.deepEqual(mutation.value, [true], '.value')
            t.equal(mutation.oldValue, undefined, '.oldValue')
            t.deepEqual(mutation.path, [2,'array'], '.path')
        }
    }
    dop.observe(array.array, fun)
    set(array.array, 5, [true])
    dop.unobserve(array.array, fun)


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array[5], '.object')
        t.equal(mutation.prop, 0, '.prop')
        t.equal(mutation.value, false, '.value')
        t.equal(mutation.oldValue, true, '.oldValue')
        t.deepEqual(mutation.path, [2,'array',5], '.path')
    }
    dop.observe(array.array[5], fun)
    set(array.array[5], 0, false)
    dop.unobserve(array.array[5], fun)

    t.end();
});


test('Array.del', function(t) {
    var a = array.array[5]
    t.deepEqual(dop.getObjectPath(a), [2,'array',5])

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 5, '.prop')
        t.equal(mutation.value, undefined, '.value')
        t.deepEqual(mutation.oldValue, [false], '.oldValue')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }
    dop.observe(array.array, fun)
    del(array.array, 5)
    dop.unobserve(array.array, fun)
    t.equal(dop.getObjectPath(a), undefined)

    t.end();
});



test('Array.splice', function(t) {
    fun = function(mutations) {
        var mutation = mutations[0]
        var arr = []
        arr.length = 3
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.splice, [ 3, 3, [ true ] ], '.splice')
        t.deepEqual(mutation.spliced, arr, '.spliced')
        t.equal(mutation.spliced.length, arr.length, '.spliced length')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }
    dop.observe(array.array, fun)
    array.array.splice(3,3,[true])
    dop.unobserve(array.array, fun)


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.splice, [ 3, 1, [ false ] ], '.splice')
        t.deepEqual(mutation.spliced, [[true]], '.spliced')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }
    dop.observe(array.array, fun)
    array.array.splice(3,1,[false])
    dop.unobserve(array.array, fun)


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.splice, [ 1, 0, {deep:true} ], '.splice')
        t.deepEqual(mutation.spliced, undefined, '.spliced')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }
    dop.observe(array.array, fun)
    array.array.splice(1,0,{deep:true})
    dop.unobserve(array.array, fun)


    t.end();
});




test('Array.reverse', function(t) {

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.swaps, [0,4,1,3], '.swaps')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }

    var objDeep = array.array[1]
    t.deepEqual(dop.getObjectPath(objDeep), [2,'array',1], 'getObjectPath')
    dop.observe(array.array, fun)
    array.array.reverse()
    dop.unobserve(array.array, fun)
    t.equal(objDeep, array.array[3])
    t.deepEqual(dop.getObjectPath(objDeep), [2,'array',3], 'getObjectPath')


    t.end();
});





test('Array.sort', function(t) {

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.swaps, [0,4,1,2], '.swaps')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }

    var objDeep = array.array[0]
    t.deepEqual(dop.getObjectPath(objDeep), [2,'array',0], 'getObjectPath')
    dop.observe(array.array, fun)
    array.array.sort()
    dop.unobserve(array.array, fun)
    t.equal(objDeep, array.array[4])
    t.deepEqual(dop.getObjectPath(objDeep), [2,'array',4], 'getObjectPath')

    t.end();
});