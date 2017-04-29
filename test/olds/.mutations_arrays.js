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

var objectServer = dop.register([]);
var objectClient = dopClient.register([]);
var objectClientTwo = dopClientTwo.register([]);

function MyClass(){this.classProperty=123;}
function maketest(t, collectorServer, checkpatchs) {
    
    var objectClientCopy = dop.util.merge([],objectClient);

    var patchServer = decode(encode(dop.core.getPatch(collectorServer.mutations)));
    var unpatch = decode(encode(dop.core.getUnpatch(collectorServer.mutations)));
    collectorServer.destroy();
    var collectorClient = dopClient.core.setPatch(attachObjects(patchServer,objectClient));
    var patchClient = decode(encode(dop.core.getPatch(collectorClient.mutations)));
    var collectorClientTwo = dopClientTwo.core.setPatch(attachObjects(patchClient, objectClientTwo));
    consolelog("### Mutations length: " +  collectorServer.mutations.length, collectorClient.mutations.length, collectorClientTwo.mutations.length );
    var patchClientTwo = dop.core.getPatch(collectorClientTwo.mutations);

    consolelog("### After server: " + encode(objectServer));
    consolelog("### After client: " + encode(objectClient));
    consolelog("### Patch1: " + encode(patchServer[1]));
    consolelog("### Patch2: " + encode(patchClient[1]));
    consolelog("### Patch3: " + encode(patchClientTwo[1]));
    consolelog("### Unpatch: " + encode(unpatch[1]));
    t.deepEqual(objectClient, objectServer, 'deepEqual');
    t.equal(encode(objectClient), encode(objectServer), 'equal');
    t.equal(objectClient.length, objectServer.length, 'length');
    t.deepEqual(objectClientTwo, objectServer, 'deepEqual objectClientTwo');
    t.equal(encode(objectClientTwo), encode(objectServer), 'equal objectClientTwo');
    t.equal(objectClientTwo.length, objectServer.length, 'length objectClientTwo');
    if (checkpatchs!==false)
    t.equal(encode(patchServer), encode(patchClientTwo), 'equal encode patchs');

    // Unpatch
    dop.core.setPatch(attachObjects(unpatch,objectServer)).destroy();
    dopClient.core.setPatch(attachObjects(unpatch,objectClient)).destroy();
    consolelog("### Undo client: " + encode(objectClient));
    t.deepEqual(objectServer, objectClientCopy, 'deepEqual unpatch server');
    t.deepEqual(objectClient, objectClientCopy, 'deepEqual unpatch client');
    t.equal(objectClientCopy.length, objectClient.length, 'length unpatch');
    dop.core.setPatch(attachObjects(patchServer,objectServer)).destroy();
    dopClient.core.setPatch(attachObjects(patchServer,objectClient)).destroy();
    t.equal(objectClient.length, objectServer.length, 'length unpatch');
    consolelog("### Redo client: " + encode(objectClient));

    consolelog( '' );
    consolelog( '' );
}

function attachObjects(patchs, obj) {
    for (var object_id in patchs)
        patchs[object_id].object = obj;
    return patchs;
}





////////////////
/////// Plain objects
////////////////



test('Adding property', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, '1', 'one');
    // tests
    maketest(t, collector);
    t.end();
});


test('Editing property with the same value', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 0, 'one');
    // tests
    maketest(t, collector);
    t.end();
});


test('Editing property already registered', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 0, 'oneChanged');
    // tests
    maketest(t, collector);
    t.end();
});


test('Delete property', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    del(objectServer, 0);
    // tests
    maketest(t, collector);
    t.end();
});


test('Change and delete a removed item', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 0, 'Changeddd');
    del(objectServer, 0);
    set(objectServer, 1, 'dos');
    // tests
    maketest(t, collector, false);
    t.end();
});

test('Creating a subobject', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 0, {});
    // tests
    maketest(t, collector);
    t.end();
});

test('Adding a property of the subobject', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer[0], 'one', 'uno');
    // tests
    maketest(t, collector);
    t.end();
});

test('Adding a subobject of subobject', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, '1', {two:'dos'});
    // tests
    maketest(t, collector);
    t.end();
});






test('Push and shifts', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    objectServer.push({one:'one'});
    objectServer.shift();
    objectServer.push({two:'two'});
    objectServer.shift();
    objectServer.push({three:'three'});
    objectServer.shift();
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
    set(objectServer, 0, []);
    // tests
    maketest(t, collector);
    t.end();
});

test('Creating a subarray with items', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 0, [1,2,[3,4]]);
    // tests
    maketest(t, collector);
    t.end();
});


test('Editing items of array', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 0, 'Changed');
    // tests
    maketest(t, collector);
    t.end();
});


test('Pushing and unshift', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    objectServer.unshift();
    var l = objectServer.push(5,[6,7]);
    objectServer.splice(l-2,1);
    // tests
    maketest(t, collector);
    t.end();
});


test('Reverse', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    objectServer.reverse();
    // tests
    maketest(t, collector);
    t.end();
});


test('Sort', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    objectServer.sort();
    // tests
    maketest(t, collector);
    t.end();
});


test('All array mutations', function(t) {
    consolelog("### Before Server: " + encode(objectServer));
    consolelog("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, 4, 'Changed Again');
    objectServer.push({new:"Item"});
    set(objectServer[5], 'Other', 'property');
    objectServer.sort();
    objectServer.pop();
    objectServer.push({new2:"Item2"});
    set(objectServer[5], 'Other2', 'property2');
    objectServer.reverse();
    // tests
    maketest(t, collector, false);
    t.end();
});