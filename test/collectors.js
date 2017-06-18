
var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/dop.nodejs').create();




var object = dop.register({});


test('Collect as default', function(t) {
    var collector = dop.collect();
    dop.set(object, 'array', []);
    t.equal(collector.mutations.length, 1);
    t.equal(collector.mutations[0].object.array, object.array);
    collector.destroy();
    t.end();
});


test('Multiple collectors order', function(t) {
    var collector1 = dop.collect();
    var collector2 = dop.collect();
    object.array.push(Math.random());
    t.equal(collector1.mutations.length, 1);
    t.equal(collector2.mutations.length, 0);
    collector1.destroy();
    collector2.destroy();
    t.end();
});


test('Using collectFirst', function(t) {
    var collector1 = dop.collect();
    var collector2 = dop.collectFirst();
    object.array.push(Math.random());
    var collector3 = dop.collect();
    object.array.push(Math.random());
    var collector4 = dop.collectFirst();
    object.array.push(Math.random());
    t.equal(collector1.mutations.length, 0);
    t.equal(collector2.mutations.length, 2);
    t.equal(collector3.mutations.length, 0);
    t.equal(collector4.mutations.length, 1);
    collector1.destroy();
    collector2.destroy();
    collector3.destroy();
    collector4.destroy();
    t.end();
});



test('Active and inactive collectores', function(t) {
    var collector1 = dop.collect();
    object.array.push(Math.random());
    var collector2 = dop.collect();
    object.array.push(Math.random());
    collector1.active = false;
    object.array.push(Math.random());
    collector1.active = true;
    object.array.push(Math.random());
    t.equal(collector1.mutations.length, 3);
    t.equal(collector2.mutations.length, 1);
    collector1.destroy();
    collector2.destroy();
    t.end();
});



test('Destroying', function(t) {
    var collector1 = dop.collect();
    object.array.push(Math.random());
    var collector2 = dop.collect();
    object.array.push(Math.random());
    collector1.destroy();
    object.array.push(Math.random());
    t.equal(collector1.mutations.length, 2);
    t.equal(collector2.mutations.length, 1);
    collector1.destroy();
    collector2.destroy();
    t.end();
});


test('Filtering', function(t) {
    var totalArray = object.array.length;
    var collector1 = dop.collect(function(mutation){
        return (mutation.object.length===totalArray+1);
    });
    object.array.push(Math.random());
    var collector2 = dop.collect();
    object.array.push(Math.random());
    t.equal(collector1.mutations.length, 1);
    t.equal(collector2.mutations.length, 1);
    collector1.destroy();
    collector2.destroy();
    t.end();
});



test('Emit', function(t) {
    var collector = dop.collect();
    object.array.push(Math.random());
    t.equal(collector.mutations.length, 1);
    collector.emitWithoutDestroy();
    t.equal(collector.mutations.length, 0);
    object.array.push(Math.random());
    t.equal(collector.mutations.length, 1);
    collector.emit();
    object.array.push(Math.random());
    t.equal(collector.mutations.length, 0);
    t.end();
});
