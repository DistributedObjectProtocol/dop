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

var objectServer = dop.register({});
var objectClient = dopClient.register({});
var objectClientTwo = dopClientTwo.register({});

caca

function applyAction(collectorServer) {
    var actionServer = collectorServer.getAction();
    collectorServer.destroy();
    debugger;
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




test('Adding special values', function(t) {
    t.comment("### Before: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'string', 'string');
    set(objectServer, 'boolean', true);
    set(objectServer, 'number', -123);
    set(objectServer, 'Infinity', -Infinity);
    set(objectServer, 'float', 1.234153454354341);
    set(objectServer, 'long', 12313214234312324353454534534);
    set(objectServer, 'undefined', undefined);
    set(objectServer, 'null', null);
    set(objectServer, 'class', new MyClass());
    set(objectServer, 'date',  new Date());
    set(objectServer, 'regexp',  /molamazo/g);
    // set(objectServer, 'function',  dop.core.remoteFunction());
    // // set(objectServer, 'symbol', Symbol('sym'));
    // // set(objectServer, 'NaN', NaN);
    var actions = applyAction(collector);
    console.log( objectClient.function )
    // tests
    maketest(t, actions);
});
