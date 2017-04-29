
var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../../dist/nodejs');
var set = dop.set;
var del = dop.del;
var object = dop.register({
    prop:"prop",
    subobject:{}
});
var object_id = 1;


test('Update a property with method set must return the value', function(t) {
    var ret = set(object, 'prop', 'newvalue');
    t.equal(ret, 'newvalue');
    t.end();
});

test('Add a property with method set must return the value', function(t) {
    var ret = set(object, 'newprop', 'newpropvalue');
    t.equal(ret, 'newpropvalue');
    t.end();
});

test('Update a property with the same value return the value', function(t) {
    var ret = set(object, 'prop', 'newvalue');
    t.equal(ret, 'newvalue');
    t.end();
});


test('Update a property no writable return same value but do not change value', function(t) {
    Object.defineProperty(object, 'nowritable', {value:1234, configurable:true});
    var ret = set(object, 'nowritable', 'newvalue');
    t.equal(ret, 'newvalue');
    t.equal(object.nowritable, 1234);
    t.end();
});

test('Update a property no configurable return same value and change property', function(t) {
    Object.defineProperty(object, 'noconfigurable', {value:1234, writable:true});
    var ret = set(object, 'noconfigurable', 'newvalue');
    t.equal(ret, 'newvalue');
    t.equal(object.noconfigurable, 'newvalue');
    t.end();
});

test('Update a property as RegExp should not be registered', function(t) {
    var ret = set(object, 'prop', /regexp/);
    t.equal(dop.getObjectDop(object.prop), undefined);
    t.end();
});

test('Update a property as Date should not be registered', function(t) {
    var ret = set(object, 'prop', new Date());
    t.equal(dop.getObjectDop(object.prop), undefined);
    t.end();
});



test('Del a property return true and value is deleted', function(t) {
    var ret = del(object, 'prop');
    t.equal(ret, true);
    t.equal(object.prop, undefined);
    t.end();
});


test('Del a property that is not defined return false', function(t) {
    var ret = del(object, 'prop');
    t.equal(ret, false);
    t.equal(object.prop, undefined);
    t.end();
});


test('Del a property no configurable return false and value do not change', function(t) {
    var ret = del(object, 'noconfigurable');
    t.equal(ret, false);
    t.equal(object.noconfigurable, 'newvalue');
    t.end();
});

test('Del a property no writable return true and value is deleted', function(t) {
    var ret = del(object, 'nowritable');
    t.equal(ret, true);
    t.equal(object.nowritable, undefined);
    t.end();
});










test('Add a new subobject must convert it as register', function(t) {
    set(object, 'new', {isregisterd:true});
    var dopobject = dop.getObjectDop(object.new);
    t.equal(typeof dopobject, 'object');
    // t.equal(JSON.stringify(dopobject), JSON.stringify([object_id, 'new']));
    t.end();
});


test('Add a new subobject that content another register object must create a new one', function(t) {
    var newregisteredobject = dop.register({test:111});
    set(object, 'registered', {object:newregisteredobject});
    var dopobject = dop.getObjectDop(object.registered.object);
    t.equal(typeof dopobject, 'object');
    // t.equal(JSON.stringify(dopobject), JSON.stringify([object_id, 'registered', 'object']));
    t.end();
});


test('Copying object already registered must create a new one', function(t) {
    set(object, 'new2', object.new);
    var dopobject = dop.getObjectDop(object.new2);
    t.equal(object.new === object.new2, false);
    // t.equal(JSON.stringify(dopobject), JSON.stringify([object_id, 'new2']));
    t.end();
});



test('Copying object already registered into another deep object', function(t) {
    set(object.subobject, 'new', object.new);
    var dopobject = dop.getObjectDop(object.subobject.new);
    t.equal(object.subobject.new === object.new, false);
    // t.equal(JSON.stringify(dopobject), JSON.stringify([object_id, 'subobject', 'new']));
    t.end();
});









test('Update a property seal return same value and change property', function(t) {
    Object.seal(object);
    var ret = set(object, 'new', 'newsealvalue');
    t.equal(ret, 'newsealvalue');
    t.equal(object.new, 'newsealvalue');
    t.end();
});

test('Add a property seal return same value and dont add anything', function(t) {
    var ret = set(object, 'newseal', 'newsealvalue');
    t.equal(ret, 'newsealvalue');
    t.equal(object.newseal, undefined);
    t.end();
});

test('Del a property seal return false and dont delete the property', function(t) {
    var ret = del(object, 'new');
    t.equal(ret, false);
    t.equal(object.new, 'newsealvalue');
    t.end();
});


test('Update a property freeze return same value and dont change property', function(t) {
    Object.freeze(object);
    var ret = set(object, 'new', 'newfreezevalue');
    t.equal(ret, 'newfreezevalue');
    t.equal(object.new, 'newsealvalue');
    t.end();
});
