
var test = require('tape');
// require('tabe').createStream( test );
var requireNew = require('require-new');
var dopServer = require('../dist/nodejs');
var dopClient = dopServer.dopFactory();
var set = dopServer.set;
var del = dopServer.del;
var encode = dopServer.encode;





var objectServer = dopServer.register({});
var objectClient = dopClient.register({});


function applyAction(collector) {
    dopClient.setAction(collector.getAction());
    collector.destroy();
}






////////////////////
/////////// OBJECTS
////////////////////



test('Adding property', function(t) {
    // mutations
    var collector = dopServer.collect();
    set(objectServer, 'one', 'one');
    applyAction(collector);
    // tests
    t.deepEqual(objectClient, objectServer);
    t.equal(encode(objectClient), encode(objectServer), encode(objectClient));
    t.end();
});


test('Editing property with the same value', function(t) {
    // mutations
    var collector = dopServer.collect();
    set(objectServer, 'one', 'one');
    applyAction(collector);
    // tests
    t.deepEqual(objectClient, objectServer);
    t.equal(encode(objectClient), encode(objectServer), encode(objectClient));
    t.end();
});


test('Editing property already registered', function(t) {
    // mutations
    var collector = dopServer.collect();
    set(objectServer, 'one', 'oneChanged');
    applyAction(collector);
    // tests
    t.deepEqual(objectClient, objectServer);
    t.equal(encode(objectClient), encode(objectServer), encode(objectClient));
    t.end();
});


test('Delete property', function(t) {
    // mutations
    var collector = dopServer.collect();
    del(objectServer, 'one');
    applyAction(collector);
    // tests
    t.deepEqual(objectClient, objectServer);
    t.equal(encode(objectClient), encode(objectServer), encode(objectClient));
    t.end();
});






// test('Adding new property', function(t) {
//     var collector = dopServer.collect();
//     objectServer.array=[];
//     applyAction(collector.getAction());
//     t.deepEqual(objectServer, objectClient);
//     t.end();
// });


// test('Editing property', function(t) {
//     var collector = dopServer.collect();
//     set(objectServer, 'array', []);
//     set(objectServer.array, 0, {subobject:'uno', megasub:{end:'end'}});
//     del(objectServer, 'array');
//     // set(objectServer.array, '1', {subobject:'dos'});
//     // set(objectServer.array[0],'subobject', 'unoChanged');
//     // set(objectServer.array[0].megasub, 'end', 'FIN');
//     // objectServer.array.shift();
//     // set(objectServer.array[0],'subobject', 'dosChanged');
//     applyAction(collector.getAction());
//     // t.deepEqual(objectServer, objectClient);
//     t.end();
// });

