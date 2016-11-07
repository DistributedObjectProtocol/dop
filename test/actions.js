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
var objectClient = dopClient.register({array:['A']});
var objectClientTwo = dopClientTwo.register({array:['B']});


function applyAction(collectorServer) {
    var actionServer = collectorServer.getAction();
    collectorServer.destroy();
    var collectorClient = dopClient.setAction(decode(encode(actionServer)), false);
    var actionClient = collectorClient.getAction();
    var collectorClientTwo = dopClientTwo.setAction(decode(encode(actionClient)), false);
    // var actionClientTwo = collectorClientTwo.getAction();
    return [actionServer, actionClient];
}

function maketest(t, actions) {
    t.comment("#  " + encode(actions[0]));
    t.deepEqual(objectClient, objectServer);
    t.equal(encode(objectClient), encode(objectServer), 'equal Result: '+encode(objectServer));



    // t.deepEqual(objectClientTwo, objectServer, 'deepEqual Action: '+encode(actions[1]));
    // t.equal(encode(objectClientTwo), encode(objectServer), 'equal Result: '+encode(objectClient));
    t.end();
}




////////////////////
/////////// ARRAYS
////////////////////


test('Adding property array', function(t) {
    // mutations
    var collector = dop.collect();
    set(objectServer, 'array', {});
    set(objectServer, 'array', []);
    objectServer.array.push(1,2,3,4)
    // objectServer.array.push('1,2,3,4')
    // set(objectServer.array, 1, {});
    // set(objectServer.array, 3, 'CUATRO');
    // objectServer.array.splice(0,1);
    // objectServer.array.push('mola');
    // set(objectServer.array[0], 'subpro', {});
    // objectServer.array.reverse();
    var actions = applyAction(collector);
    // tests
    maketest(t, actions);
});




// test('empty object', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'array', {});
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{}}', encode(action));
//     console.log( '' );
//     t.end();
// });

// test('empty array from object', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'array', []);
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"~dop":[[0]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });


// test('empty array from undefined', function(t) {
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 'array');
//     set(objectServer, 'array', []);
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"~dop":[[0]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });


// test('empty array from array', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'array', []);
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"~dop":[[0]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });

// test('empty array from not empty array', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.array, 0, 'A');
//     set(objectServer, 'array', []);
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"~dop":[[0]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });

// test('no empty array from not empty array', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'array', ['C','D']);
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"~dop":[[0],[0,0,"C","D"]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });


// test('adding item as property', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.array, 0, 'A');
//     set(objectServer.array, 1, 'B');
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"~dop":[[0,0,"A"],[1,0,"B"]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });

// test('push item', function(t) {
//     // mutations
//     var collector = dop.collect();
//     objectServer.array.push('C')
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"~dop":[[2,0,"C"]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });


// test('delete array', function(t) {
//     // mutations
//     var collector = dop.collect();
//     del(objectServer,'array');
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":"~U"}', encode(action));
//     console.log( '' );
//     t.end();
// });


// test('add array from delete and multiple mutations', function(t) {
//     // mutations
//     var collector = dop.collect();
//     debugger;
//     set(objectServer,'array', ['LOL',{}]);
//     set(objectServer.array[1], 'the', 'END');
//     set(objectServer.array, 2, 'B');
//     objectServer.array.shift();
//     collector.destroy();
//     var action = collector.getAction()[1];
//     t.equal(encode(action),'{"array":{"0":{"the":"END"},"~dop":[[0],[0,0,"LOL",{}],[2,0,"B"],[0,1]]}}', encode(action));
//     console.log( '' );
//     t.end();
// });















////////////////////
/////////// OBJECTS
////////////////////



// test('Adding property', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'one', 'one');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });


// test('Editing property with the same value', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'one', 'one');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });


// test('Editing property already registered', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'one', 'oneChanged');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });


// test('Delete property', function(t) {
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 'one');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });


// test('Change and delete a removed item', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'one', 'Changeddd');
//     del(objectServer, 'one');
//     set(objectServer, 'two', 'two');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });

// test('Creating a subobject', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer, 'one', {});
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });

// test('Adding a property of the subobject', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one, 'one', 'uno');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });

// test('Adding a subobject of subobject', function(t) {
//     // mutations
//     var collector = dop.collect();
//     del(objectServer, 'two');
//     set(objectServer.one, 'two', {two:'dos'});
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });

// test('Editing a property of subobject', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'two', 'dosChanged');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });

// test('Editing a property of subobject and after removing the parent', function(t) {
//     // mutations
//     var collector = dop.collect();
//     set(objectServer.one.two, 'two', 'dosChangedAgain');
//     del(objectServer, 'one');
//     var action = applyAction(collector);
//     // tests
//     maketest(t, objectClient, objectServer, action);
// });

