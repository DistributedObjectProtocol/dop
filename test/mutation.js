var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs').create();
var dopClient = dop.create();
var dopClientTwo = dop.create();
var set = dop.set;
var del = dop.del;


var object = dop.register({deep1:{deep2:{}}});

test('Object.set', function(t) {
    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object, '.object')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.deepEqual(mutation.path, [1], '.path')
    }
    dop.observe(object, fun)
    set(object, 'newprop', '12345')
    dop.unobserve(object, fun)


    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1, '.object')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
        t.deepEqual(mutation.path, [1,'deep1'], '.path')
    }
    dop.observe(object.deep1, fun)
    set(object.deep1, 'newprop', '12345')
    dop.unobserve(object.deep1, fun)
    

    fun = function(mutations) {
        var mutation = mutations[0]
        t.equal(mutation.object, object.deep1.deep2, '.object')
        t.equal(mutation.oldValue, undefined, '.oldValue')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '12345', '.value')
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
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, undefined, '.value')
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
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, undefined, '.value')
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
        t.equal(mutation.oldValue, '12345', '.oldValue')
        t.equal(mutation.prop, 'newprop', '.prop')
        t.equal(mutation.value, '67890', '.value')
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
        t.deepEqual(mutation.oldValue, dop.util.clone(deep2), '.oldValue')
        t.equal(mutation.prop, 'deep2', '.prop')
        t.deepEqual(mutation.value, {}, '.value')
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
        t.deepEqual(mutation.oldValue, undefined, '.oldValue')
        t.equal(mutation.prop, 'deep3', '.prop')
        t.deepEqual(mutation.value, 'hola mundo', '.value')
        t.deepEqual(mutation.path, [1,'deep1','deep2'], '.path')
    }
    dop.observe(object.deep1.deep2, fun)
    set(object.deep1.deep2, 'deep3', 'hola mundo')
    dop.unobserve(object.deep1.deep2, fun)

    t.end();
});