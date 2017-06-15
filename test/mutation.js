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
    var observer = dop.observe(object, fun)
    set(object, 'newprop', '12345')
    observer.destroy()


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    var observer = dop.observe(object.deep1, fun)
    set(object.deep1, 'newprop', '12345')
    observer.destroy()
    

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1','deep2'], '.path')
    }
    var observer = dop.observe(object.deep1.deep2, fun)
    set(object.deep1.deep2, 'newprop', '12345')
    observer.destroy()
    
    
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
    var observer = dop.observe(object, fun)
    del(object, 'newprop')
    observer.destroy()


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, undefined, '.value')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    var observer = dop.observe(object.deep1, fun)
    del(object.deep1, 'newprop')
    observer.destroy()
    

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, undefined, '.value')
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1','deep2'], '.path')
    }
    var observer = dop.observe(object.deep1.deep2, fun)
    del(object.deep1.deep2, 'newprop')
    observer.destroy()
    
    
    t.end();
});

test('Object.del change value', function(t) {
    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '67890', '.value')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    var observer = dop.observe(object.deep1, fun)
    set(object.deep1, 'newprop', '67890')
    observer.destroy()

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
    var observer = dop.observe(object.deep1, fun)
    set(object.deep1, 'deep2', {})
    observer.destroy()


    fun = function(mutations) {
        t.equal(true, false, "This mutation shouldn't be observed because deep2 is not inside of object anymore")
    }
    var observer = dop.observe(deep2, fun)
    set(deep2, 'deep3', {deeper:true})
    observer.destroy()



    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.prop, 'deep3', '.prop')
        t.deepEqual(mutation.value, 'hola mundo', '.value')
        t.deepEqual(mutation.oldValue, undefined, '.oldValue')
        t.deepEqual(mutation.path, [1,'deep1','deep2'], '.path')
    }
    var observer = dop.observe(object.deep1.deep2, fun)
    set(object.deep1.deep2, 'deep3', 'hola mundo')
    observer.destroy()

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
    var observer = dop.observe(array.array, fun)
    var observer2 = dop.observe(array.array, "length", function(mutations){
        t.equal(mutations.length, 1, 'mutations length')
    })
    set(array.array, 5, [true])
    observer.destroy()
    observer2.destroy()


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array[5], '.object')
        t.equal(mutation.prop, 0, '.prop')
        t.equal(mutation.value, false, '.value')
        t.equal(mutation.oldValue, true, '.oldValue')
        t.deepEqual(mutation.path, [2,'array',5], '.path')
    }
    var observer = dop.observe(array.array[5], fun)
    set(array.array[5], 0, false)
    observer.destroy()

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
    var observer = dop.observe(array.array, fun)
    del(array.array, 5)
    observer.destroy()
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
    var observer = dop.observe(array.array, fun)
    var observer2 = dop.observe(array.array, "length", function(mutations){
        t.equal(mutations.length, 1, 'mutations length')
        var mutation = mutations[0]
        t.deepEqual(array.array.length, 4, 'array.array.length')
        t.deepEqual(mutation.object.length, 4, '.object.length')
        t.deepEqual(mutation.oldLength, 6, '.oldLength')
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.splice, [ 3, 3, [ true ] ], '.splice')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    })
    array.array.splice(3,3,[true])
    observer.destroy()
    observer2.destroy()


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.splice, [ 3, 1, [ false ] ], '.splice')
        t.deepEqual(mutation.spliced, [[true]], '.spliced')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }
    var observer = dop.observe(array.array, fun)
    array.array.splice(3,1,[false])
    observer.destroy()


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, array.array, '.object')
        t.equal(mutation.prop, 'array', '.prop')
        t.deepEqual(mutation.splice, [ 1, 0, {deep:true} ], '.splice')
        t.deepEqual(mutation.spliced, undefined, '.spliced')
        t.deepEqual(mutation.path, [2,'array'], '.path')
    }
    var observer = dop.observe(array.array, fun)
    array.array.splice(1,0,{deep:true})
    observer.destroy()


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
    var observer = dop.observe(array.array, fun)
    array.array.reverse()
    observer.destroy()
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
    var observer = dop.observe(array.array, fun)
    array.array.sort()
    observer.destroy()
    t.equal(objDeep, array.array[4])
    t.deepEqual(dop.getObjectPath(objDeep), [2,'array',4], 'getObjectPath')

    t.end();
});