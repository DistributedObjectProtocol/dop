
var test = require('tape');
// require('tabe').createStream( test );
var requireNew = require('require-new');
var dopServer = require('../dist/nodejs');
var dopClient = dopServer.dopFactory();





var objectServer = dopServer.register({hola:"Mundo", array:[]});
var objectClient = dopClient.register({hola:"Mundo"});


function applyAction(action) {
    dopClient.setAction(action);
}

// test('Editing property', function(t) {
//     var collector = dopServer.collect();
//     objectServer.hola='cruel';
//     objectServer.hola='cruel repe';
//     applyAction(collector.getAction());
//     t.deepEqual(objectServer, objectClient);
//     t.end();
// });

// test('Adding new property', function(t) {
//     var collector = dopServer.collect();
//     objectServer.array=[];
//     applyAction(collector.getAction());
//     t.deepEqual(objectServer, objectClient);
//     t.end();
// });


test('Editing property', function(t) {
    var collector = dopServer.collect();
    objectServer.array[0]="string";
    objectServer.array[1]={object:'data'};
    objectServer.array.shift();
    objectServer.array[0].object='Changed';
    applyAction(collector.getAction());
    // t.deepEqual(objectServer, objectClient);
    t.end();
});

