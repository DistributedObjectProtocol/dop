var test = require('tape');
// require('tabe').createStream( test );
var dop = require('./.proxy').create();
var set = dop.set;
var del = dop.del;
dop.observe = function(object, property) {
    var args = arguments;
        callback = args[args.length-1];

    var observer = dop.createObserver(callback);
    
    (args.length===2) ?
        observer.observe(object)
    :
        observer.observe(object, property);
        
    return observer;
};

var object = dop.register({deep1:{deep2:{}}});
var array = dop.register({array:[1,2,3]});

test('Object.set', function(t) {
    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object, '.object')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.equal(mutation.old_value, undefined, '.old_value')
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
        t.equal(mutation.old_value, undefined, '.old_value')
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
        t.equal(mutation.old_value, undefined, '.old_value')
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
        t.equal(mutation.old_value, '12345', '.old_value')
        t.deepEqual(mutation.path, [1], '.path')
    }
    var observer = dop.observe(object, fun)
    del(object, 'newprop')
    observer.destroy()


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.old_value, '12345', '.old_value')
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
        t.equal(mutation.old_value, '12345', '.old_value')
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
        t.equal(mutation.old_value, undefined, '.old_value')
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
        t.deepEqual(mutation.old_value, dop.util.clone(deep2), '.old_value')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    var observer = dop.observe(object.deep1, fun)
    set(object.deep1, 'deep2', {})
    observer.destroy()


    try {
        var observer = dop.observe(deep2, function(){})
    }
    catch(e) {
        t.equal(e instanceof Error, true, 'This must throw an error because deep2 is not inside of a registered object anymore')
    }



    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.prop, 'deep3', '.prop')
        t.deepEqual(mutation.value, 'hola mundo', '.value')
        t.deepEqual(mutation.old_value, undefined, '.old_value')
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
            t.equal(mutation.prop, "5", '.prop')
            t.deepEqual(mutation.value, [true], '.value')
            t.equal(mutation.old_value, undefined, '.old_value')
            t.deepEqual(mutation.path, [2,'array'], '.path')
            first = false
        }
        else {
            t.equal(mutation.object, array.array, '.object')
            t.equal(mutation.prop, 'length', '.prop')
            t.deepEqual(mutation.value, 6, '.value')
            t.equal(mutation.old_value, 3, '.old_value')
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
        t.equal(mutation.prop, "0", '.prop')
        t.equal(mutation.value, false, '.value')
        t.equal(mutation.old_value, true, '.old_value')
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
        t.equal(mutation.prop, "5", '.prop')
        t.equal(mutation.value, undefined, '.value')
        t.deepEqual(mutation.old_value, [false], '.old_value')
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
        t.deepEqual(mutation.old_length, 6, '.old_length')
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





test('Same items after array mutations', function(t) {
    var array = dop.register({array:[{a:1},{b:2},{c:3}]});
    var obj = dop.register({e:5});
    var tmp = array.array[0]
    array.array.unshift({d:4})
    t.equal(tmp, array.array[1], 'same object after unshift')
    
    array.array.reverse()
    t.equal(tmp, array.array[2], 'same object after reverse')

    array.array.unshift(obj)
    t.deepEqual(obj, array.array[0], 'should be the same')
    t.notEqual(obj, array.array[0], 'should be different')

    t.deepEqual(dop.getObjectPath(obj), [4], 'correct path')
    t.deepEqual(dop.getObjectPath(array.array[0]), [3,"array",0], 'correct path')


    t.end();
});



test('Setting objects already registered', function(t) {
    var a = dop.register({a:1});
    var b = dop.register({b:2});

    set(a,'b',b)    

    t.deepEqual(a.b, b, 'should be the same')
    t.notEqual(a.b, b, 'should be different')
    t.deepEqual(dop.getObjectPath(a.b), [5,"b"], 'correct path')
    t.deepEqual(dop.getObjectPath(b), [6], 'correct path')


    t.end();
});


test('unobserve = observer.observe(...)', function(t) {
    var object = dop.register({})
    var times = 0
    var observer = dop.createObserver(function(mutations) {
        times += 1
    })
    var tounobserve = observer.observe(object)
    set(object, 'newprop', '12345')
    t.equal(times, 1)
    set(object, 'newprop', '12345')
    t.equal(times, 1)
    set(object, 'newprop', '555')
    t.equal(times, 2)
    tounobserve()
    set(object, 'newprop', 'blabla')
    t.equal(times, 2)

    t.end()
})



test('mutating length of array', function(t) {
    var object = dop.register({array:[1,2,3]})
    var times = 0
    var observer = dop.createObserver(function(mutations) {
        times += 1
    })
    observer.observe(object.array)
    observer.observe(object.array, 'length')
    set(object.array, 'length', 1)
    t.equal(object.array.length, 1)
    t.equal(times, 1)
    

    t.end()
})