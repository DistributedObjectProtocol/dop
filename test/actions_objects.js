var test = require('tape');
// require('tabe').createStream( test );
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
    var actionServer = decode(encode(collectorServer.getAction()));
    collectorServer.destroy();
    var collectorClient = dopClient.setAction(actionServer, false);
    var actionClient = decode(encode(collectorClient.getAction()));
    var collectorClientTwo = dopClientTwo.setAction(actionClient, false);
    console.log("### Mutations length: " +  collectorServer.mutations.length, collectorClient.mutations.length, collectorClientTwo.mutations.length );
    var actionClientTwo = collectorClientTwo.getAction();
    return [actionServer, actionClient, actionClientTwo];
}

function maketest(t, actions, checkactions) {
    console.log("### After server: " + encode(objectServer));
    console.log("### After client: " + encode(objectClient));
    console.log("### Action1: " + encode(actions[0][1]));
    console.log("### Action2: " + encode(actions[1][1]));
    console.log("### Action3: " + encode(actions[2][1]));
    t.deepEqual(objectClient, objectServer, 'deepEqual');
    t.equal(encode(objectClient), encode(objectServer), 'equal');
    t.deepEqual(objectClientTwo, objectServer, 'deepEqual objectClientTwo');
    t.equal(encode(objectClientTwo), encode(objectServer), 'equal objectClientTwo');
    if (checkactions!==false)
    t.equal(encode(actions[0]), encode(actions[2]), 'equal encode actions');
    console.log( '' );
    console.log( '' );
    t.end();
}
function MyClass(){this.classProperty=123;}







////////////////
/////// Plain objects
////////////////



test('Adding property', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
    t.end();
});


test('Editing property with the same value', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});


test('Editing property already registered', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'oneChanged');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});


test('Delete property', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});


test('Change and delete a removed item', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'Changeddd');
    del(objectServer, 'one');
    set(objectServer, 'two', 'two');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions, false);
});

test('Creating a subobject', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', {});
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a property of the subobject', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 'one', 'uno');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a subobject of subobject', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'two');
    set(objectServer.one, 'two', {two:'dos'});
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Editing a property of subobject', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChanged');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Editing a property of subobject and after removing the parent', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChangedAgain');
    del(objectServer, 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});




test('Adding special values', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
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





////////////////////
/////////// Classes
////////////////////


test('Creating a subclass', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'special');
    set(objectServer, 'one', new MyClass());
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a property of the subclass', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 'one', 'uno');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Adding a subobject of subclass', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'two');
    set(objectServer.one, 'two', {three:'tres'});
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Editing a property of subclass', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'three', new MyClass());
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Editing a property of subobject and after removing the parent', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChangedAgain');
    del(objectServer, 'one');
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});






////////////////////
/////////// Arrays
////////////////////


test('Creating a subarray', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', {});
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

test('Creating a subarray with items', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    debugger
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});

// test('Adding a property of the subclass', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one, 'one', 'uno');
//     var actions = applyAction(collector);
//     // tests
//     maketest(t, actions);
// });

// test('Adding a subobject of subclass', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 'two');
//     set(objectServer.one, 'two', {three:'tres'});
//     var actions = applyAction(collector);
//     // tests
//     maketest(t, actions);
// });

// test('Editing a property of subclass', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'three', new MyClass());
//         debugger;
//     var actions = applyAction(collector);
//     // tests
//     maketest(t, actions);
// });

// test('Editing a property of subobject and after removing the parent', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'two', 'dosChangedAgain');
//     del(objectServer, 'one');
//     var actions = applyAction(collector);
//     // tests
//     maketest(t, actions);
// });



