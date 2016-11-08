var test = require('tape');
// require('tabe').createStream( test );
var requireNew = require('require-new');
var dop = require('../dist/nodejs');
var dopClient = dop.create();
var dopClientTwo = dop.create();
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;

var objectServer = dop.register({},{proxy:false});
var objectClient = dopClient.register({},{proxy:false});
var objectClientTwo = dopClientTwo.register({},{proxy:false});

function applyAction(collectorServer) {
    var actionServer = collectorServer.getAction();
    collectorServer.destroy();
    debugger
    var collectorClient = dopClient.setAction(decode(encode(actionServer)), false);
    var actionClient = collectorClient.getAction();
    var collectorClientTwo = dopClientTwo.setAction(decode(encode(actionClient)), false);
    var actionClientTwo = collectorClientTwo.getAction();
    return [actionServer, actionClient, actionClientTwo];
}

function maketest(t, actions) {
    t.comment("### After: " + encode(objectClient));
    t.comment("### Action1: " + encode(actions[0][1]));
    t.comment("### Action2: " + encode(actions[1][1]));
    t.comment("### Action3: " + encode(actions[2][1]));
    t.deepEqual(objectClient, objectServer, 'deepEqual');
    t.equal(encode(objectClient), encode(objectServer), 'equal');
    t.deepEqual(objectClientTwo, objectServer, 'deepEqual objectClientTwo');
    t.equal(encode(objectClientTwo), encode(objectServer), 'equal objectClientTwo');
    // t.deepEqual(actions[0], actions[2], 'deepEqual action');
    console.log( '' );
    console.log( '' );
    t.end();
}
function MyClass(){this.test=123;}













test('Adding property', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});


test('Editing property with the same value', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});


test('Editing property already registered', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'oneChanged');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});


test('Delete property', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});


test('Change and delete a removed item', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'Changeddd');
    del(objectServer, 'one');
    set(objectServer, 'two', 'two');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Creating a subobject', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', {});
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a property of the subobject', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 'one', 'uno');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a subobject of subobject', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'two');
    set(objectServer.one, 'two', {two:'dos'});
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

// test('Editing a property of subobject', function(t) {
//     t.comment("### Before: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'two', 'dosChanged');
//     var actions = applyAction(collector);
//     // tests
//     maketest(t, actions);
// });

test('Editing a property of subobject and after removing the parent', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChangedAgain');
    del(objectServer, 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});




test('Adding special values', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'special', {});
    set(objectServer.special, 'string', 'string');
    set(objectServer.special, 'boolean', true);
    set(objectServer.special, 'number', -123);
    set(objectServer.special, 'Infinity', -Infinity);
    set(objectServer.special, 'float', 1.234153454354341);
    set(objectServer.special, 'long', 12313214234312324353454534534);
    set(objectServer.special, 'undefined', undefined);
    set(objectServer.special, 'null', null);
    set(objectServer.special, 'class', new MyClass());
    set(objectServer.special, 'date',  new Date());
    set(objectServer.special, 'regexp', /molamazo/g);
    // set(objectServer.special, 'function',  dop.core.remoteFunction());
    // // set(objectServer.special, 'symbol', Symbol('sym'));
    // // set(objectServer.special, 'NaN', NaN);
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});






test('Creating a subobject', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'special');
    set(objectServer, 'one', new MyClass());
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a property of the subobject', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 'one', 'uno');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a subobject of subobject', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'two');
    set(objectServer.one, 'two', {two:'dos'});
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Editing a property of subobject', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChanged');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Editing a property of subobject and after removing the parent', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChangedAgain');
    del(objectServer, 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

