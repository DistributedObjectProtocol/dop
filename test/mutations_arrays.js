var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs');
var dopClient = dop.create();
var dopClientTwo = dop.create();
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;

var objectServer = dop.register([]);
var objectClient = dopClient.register([]);
var objectClientTwo = dopClientTwo.register([]);

function MyClass(){this.classProperty=123;}
function maketest(t, collectorServer, checkactions) {
    
    var objectClientCopy = dop.util.merge({},objectClient);

    var actionServer = decode(encode(collectorServer.getAction()));
    var unaction = decode(encode(collectorServer.getUnaction()));
    collectorServer.destroy();
    var collectorClient = dopClient.setAction(actionServer);
    var actionClient = decode(encode(collectorClient.getAction()));
    var collectorClientTwo = dopClientTwo.setAction(actionClient);
    console.log("### Mutations length: " +  collectorServer.mutations.length, collectorClient.mutations.length, collectorClientTwo.mutations.length );
    var actionClientTwo = collectorClientTwo.getAction();

    console.log("### After server: " + encode(objectServer));
    console.log("### After client: " + encode(objectClient));
    console.log("### Action1: " + encode(actionServer[1]));
    console.log("### Action2: " + encode(actionClient[1]));
    console.log("### Action3: " + encode(actionClientTwo[1]));
    console.log("### Unaction: " + encode(unaction[1]));
    t.deepEqual(objectClient, objectServer, 'deepEqual');
    t.equal(encode(objectClient), encode(objectServer), 'equal');
    t.deepEqual(objectClientTwo, objectServer, 'deepEqual objectClientTwo');
    t.equal(encode(objectClientTwo), encode(objectServer), 'equal objectClientTwo');
    if (checkactions!==false)
    t.equal(encode(actionServer), encode(actionClientTwo), 'equal encode actions');

    // Unaction
    dopClient.setAction(unaction);
    console.log("### Undo client: " + encode(objectClient));
    t.deepEqual(objectClientCopy, objectClient, 'deepEqual unaction');
    var collectorClient = dopClient.setAction(actionServer);
    console.log("### Redo client: " + encode(objectClient));

    console.log( '' );
    console.log( '' );
}







////////////////
/////// Plain objects
////////////////



test('Adding property', function(t) {
    console.log("### Before Server: " + encode(objectServer));
    console.log("### Before Client: " + encode(objectClient));
    // mutations
    var collector = dop.collect();
    set(objectServer, '1', 'one');
    // tests
    maketest(t, collector);
    t.end();
});


// test('Editing property with the same value', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 0, 'one');
//     // tests
//     maketest(t, collector);
//     t.end();
// });


// test('Editing property already registered', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 0, 'oneChanged');
//     // tests
//     maketest(t, collector);
//     t.end();
// });


// test('Delete property', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 0);
//     // tests
//     maketest(t, collector);
//     t.end();
// });


// test('Change and delete a removed item', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 0, 'Changeddd');
//     del(objectServer, 0);
//     set(objectServer, 'two', 'two');
//     // tests
//     maketest(t, collector, false);
//     t.end();
// });

// test('Creating a subobject', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 0, {});
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Adding a property of the subobject', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one, 'one', 'uno');
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Adding a subobject of subobject', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 'two');
//     set(objectServer.one, 'two', {two:'dos'});
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Editing a property of subobject', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'two', 'dosChanged');
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Editing a property of subobject and after removing the parent', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'two', 'dosChangedAgain');
//     del(objectServer, 0);
//     // tests
//     maketest(t, collector);
//     t.end();
// });




// test('Adding special values', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'special', {});
//     set(objectServer.special, 'string', 'string');
//     set(objectServer.special, 'boolean', true);
//     set(objectServer.special, 'number', -123);
//     set(objectServer.special, 'Infinity', -Infinity);
//     set(objectServer.special, 'float', 1.234153454354341);
//     set(objectServer.special, 'long', 12313214234312324353454534534);
//     set(objectServer.special, 'undefined', undefined);
//     set(objectServer.special, 'null', null);
//     set(objectServer.special, 'class', new MyClass());
//     set(objectServer.special, 'date',  new Date());
//     set(objectServer.special, 'regexp', /molamazo/g);
//     // set(objectServer.special, 'function',  dop.core.remoteFunction());
//     // // set(objectServer.special, 'symbol', Symbol('sym'));
//     // // set(objectServer.special, 'NaN', NaN);
//     // tests
//     maketest(t, collector);
//     t.end();
// });





// ////////////////////
// /////////// Classes
// ////////////////////


// test('Creating a subclass', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 'special');
//     set(objectServer, 0, new MyClass());
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Adding a property of the subclass', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one, 'one', 'uno');
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Adding a subobject of subclass', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 'two');
//     set(objectServer.one, 'two', {three:'tres'});
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Editing a property of subclass', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'three', new MyClass());
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Editing a property of subobject and after removing the parent', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'two', 'dosChangedAgain');
//     del(objectServer, 0);
//     // tests
//     maketest(t, collector);
//     t.end();
// });






// ////////////////////
// /////////// Arrays
// ////////////////////


// test('Creating a subarray', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 0, []);
//     // tests
//     maketest(t, collector);
//     t.end();
// });

// test('Creating a subarray with items', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 0, [1,2,[3,4]]);
//     // tests
//     maketest(t, collector);
//     t.end();
// });


// test('Editing items of array', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one, 0, 'Changed');
//     // tests
//     debugger;
//     maketest(t, collector);
//     t.end();
// });


// test('Pushing and unshift', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     objectServer.one.unshift();
//     objectServer.one.push(5,[6,7]);
//     // tests
//     maketest(t, collector);
//     t.end();
// });


// test('Reverse', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     objectServer.one.reverse();
//     // tests
//     maketest(t, collector);
//     t.end();
// });


// test('Sort', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     objectServer.one.sort();
//     // tests
//     maketest(t, collector);
//     t.end();
// });


// test('All array mutations', function(t) {
//     console.log("### Before Server: " + encode(objectServer));
//     console.log("### Before Client: " + encode(objectClient));
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one, 4, 'Changed Again');
//     objectServer.one.push({new:"Item"});
//     set(objectServer.one[5], 'Other', 'property');
//     objectServer.one.sort();
//     objectServer.one.pop();
//     objectServer.one.push({new2:"Item2"});
//     set(objectServer.one[5], 'Other2', 'property2');
//     objectServer.one.reverse();
//     // tests
//     maketest(t, collector, false);
//     t.end();
// });