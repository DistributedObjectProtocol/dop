var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs').create();
var dopClient = dop.create();
var dopClientTwo = dop.create();


var objectTarget = {deep1:{deep2:{}}}
var object = dop.register(objectTarget);

test('Object root', function(t) {
    t.equal(dop.getObjectRoot(object), dop.getObjectTarget(object))
    t.equal(dop.getObjectRoot(object.deep1), dop.getObjectTarget(object))
    t.equal(dop.getObjectRoot(object.deep1.deep2), dop.getObjectTarget(object))
    t.end();
});

test('Object parent', function(t) {
    t.equal(dop.getObjectParent(object), undefined)
    t.equal(dop.getObjectParent(object.deep1), dop.getObjectTarget(object))
    t.equal(dop.getObjectParent(object.deep1.deep2), dop.getObjectTarget(object.deep1))
    t.end();
});

test('Object property', function(t) {
    t.equal(dop.getObjectProperty(object), 1)
    t.equal(dop.getObjectProperty(object.deep1), 'deep1')
    t.equal(dop.getObjectProperty(object.deep1.deep2), 'deep2')
    t.end();
});

test('Object proxy and target', function(t) {
    t.equal(dop.getObjectProxy(object), object)
    t.equal(dop.getObjectProxy(objectTarget), object)
    t.equal(dop.getObjectTarget(object), objectTarget)
    t.equal(dop.getObjectTarget(objectTarget), objectTarget)
    t.end();
});
