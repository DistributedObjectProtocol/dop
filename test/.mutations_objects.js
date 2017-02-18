var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs').create();
var dopClient = dop.create();
var dopClientTwo = dop.create();
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;

function consolelog() {
    if (typeof window == 'undefined')
        console.log.apply(this, arguments);
}

var objectServer = dop.register({});
var objectClient = dopClient.register({});
var objectClientTwo = dopClientTwo.register({});

function MyClass(){this.classProperty=123;}
function maketest(t, collectorServer, checkactions) {

    if (collectorServer.mutations.length>0) {

        var objectClientCopy = dop.util.merge({},objectClient);
        var actionServer = decode(encode(dop.core.getAction(collectorServer.mutations)));
        var unaction = decode(encode(dop.core.getUnaction(collectorServer.mutations)));
        var snapshotServer = collectorServer.emitAndDestroy();
        var collectorClient = dopClient.core.setActions(attachObjects(actionServer, objectClient));
        var actionClient = decode(encode(dop.core.getAction(collectorClient.mutations)));
        var collectorClientTwo = dopClientTwo.core.setActions(attachObjects(actionClient, objectClientTwo));
        consolelog("### Mutations length: " +  collectorServer.mutations.length, collectorClient.mutations.length, collectorClientTwo.mutations.length );
        var actionClientTwo = dop.core.getAction(collectorClientTwo.mutations);

        consolelog("### After server: " + encode(objectServer));
        consolelog("### After client: " + encode(objectClient));
        consolelog("### Action1: " + encode(actionServer[1]));
        consolelog("### Action2: " + encode(actionClient[1]));
        consolelog("### Action3: " + encode(actionClientTwo[1]));
        consolelog("### Unaction: " + encode(unaction[1]));
        t.deepEqual(objectClient, objectServer, 'deepEqual');
        t.equal(encode(objectClient), encode(objectServer), 'equal');
        t.deepEqual(objectClientTwo, objectServer, 'deepEqual objectClientTwo');
        t.equal(encode(objectClientTwo), encode(objectServer), 'equal objectClientTwo');
        if (checkactions!==false)
        t.equal(encode(actionServer), encode(actionClientTwo), 'equal encode actions');

        // Unaction
        dopClient.core.setActions(attachObjects(snapshotServer.getUnaction(), objectClient));
        t.deepEqual(objectClientCopy, objectClient, 'deepEqual unaction');
        dopClient.core.setActions(attachObjects(snapshotServer.getAction(), objectClient));

        consolelog( '' );
        consolelog( '' );
    }
}


function attachObjects(actions, obj) {
    for (var object_id in actions)
        actions[object_id].object = obj;
    return actions;
}





////////////////
/////// Plain objects
////////////////



test('Adding property', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'one');
    // tests
    maketest(t, collector);
    t.end();
});


test('Editing property with the same value', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'one');
    // tests
    maketest(t, collector);
    t.end();
});


test('Editing property already registered', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'oneChanged');
    // tests
    maketest(t, collector);
    t.end();
});


test('Delete property', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'one');
    // tests
    maketest(t, collector);
    t.end();
});


test('Change and delete a removed item', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', 'Changeddd');
    del(objectServer, 'one');
    set(objectServer, 'two', 'two');
    // tests
    maketest(t, collector, false);
    t.end();
});

test('Creating a subobject', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', {});
    // tests
    maketest(t, collector);
    t.end();
});

test('Adding a property of the subobject', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 'one', 'uno');
    // tests
    maketest(t, collector);
    t.end();
});

test('Adding a subobject of subobject', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'two');
    set(objectServer.one, 'two', {two:'dos'});
    // tests
    maketest(t, collector);
    t.end();
});

test('Editing a property of subobject', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChanged');
    // tests
    maketest(t, collector);
    t.end();
});

test('Editing a property of subobject and after removing the parent', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChangedAgain');
    del(objectServer, 'one');
    // tests
    maketest(t, collector);
    t.end();
});




test('Adding special values', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
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
    // tests
    maketest(t, collector);
    t.end();
});





////////////////////
/////////// Classes
////////////////////


test('Creating a subclass', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'special');
    set(objectServer, 'one', new MyClass());
    // tests
    maketest(t, collector);
    t.end();
});

test('Adding a property of the subclass', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 'one', 'uno');
    // tests
    maketest(t, collector);
    t.end();
});

test('Adding a subobject of subclass', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 'two');
    set(objectServer.one, 'two', {three:'tres'});
    // tests
    maketest(t, collector);
    t.end();
});

test('Editing a property of subclass', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'three', new MyClass());
    // tests
    maketest(t, collector);
    t.end();
});

test('Editing a property of subobject and after removing the parent', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one.two, 'two', 'dosChangedAgain');
    del(objectServer, 'one');
    // tests
    maketest(t, collector);
    t.end();
});






////////////////////
/////////// Arrays
////////////////////


test('Creating a subarray', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', []);
    // tests
    maketest(t, collector);
    t.end();
});

test('Creating a subarray with items', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    // tests
    maketest(t, collector);
    t.end();
});


test('Editing items of array', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 0, 'Changed');
    // tests
    maketest(t, collector);
    t.end();
});


test('Pushing and unshift', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    objectServer.one.unshift();
    objectServer.one.push(5,[6,7]);
    // tests
    maketest(t, collector);
    t.end();
});


test('Reverse', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    objectServer.one.reverse();
    // tests
    maketest(t, collector);
    t.end();
});


test('Sort', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    objectServer.one.sort();
    // tests
    maketest(t, collector);
    t.end();
});


test('All array mutations', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer.one, 4, 'Changed Again');
    objectServer.one.push({new:"Item"});
    set(objectServer.one[5], 'Other', 'property');
    objectServer.one.sort();
    objectServer.one.pop();
    objectServer.one.push({new2:"Item2"});
    set(objectServer.one[5], 'Other2', 'property2');
    objectServer.one.reverse();
    // tests
    maketest(t, collector, false);
    t.end();
});