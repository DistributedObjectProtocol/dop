var test = require('tape');
var dop = require('../dist/nodejs');
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;

var objectServer = dop.register({});
var arrayServer = dop.register([]);


function applyAction(collector) {
    var actionServer = decode(encode(collector.getAction()));
    collector.destroy();
    return actionServer[1]||actionServer;
}

function maketest(t, actionGenerated, actionExpected, checkEncode) {
    t.deepEqual(actionGenerated, actionExpected, 'deepEqual');
    if (checkEncode!==false)
    t.equal(encode(actionGenerated), encode(actionExpected), 'equal');
    console.log( '' );
    t.end();
}


test('Adding property', function(t) {
    var actionExpected = {one:1};
    var mutationsExpected = 1;


    var collector = dop.collect();
    set(objectServer, 'one', 1);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Changing property', function(t) {
    var actionExpected = {one:11};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', 11);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, 1, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Changing property with the same value', function(t) {
    var actionExpected = {};
    var mutationsExpected = 0;

    var collector = dop.collect();
    set(objectServer, 'one', 11);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Deleting property', function(t) {
    var actionExpected = {one:undefined};
    var mutationsExpected = 1;

    var collector = dop.collect();
    del(objectServer, 'one');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});

test('Change and delete a removed item', function(t) {
    var actionExpected = {two:2,one:undefined};
    var mutationsExpected = 3;

    var collector = dop.collect();
    set(objectServer, 'one', 'Changeddd');
    del(objectServer, 'one');
    set(objectServer, 'two', 2);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Setting a subobject', function(t) {
    var actionExpected = {one:{}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', {});
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});



test('Setting a subobject', function(t) {
    var actionExpected = {one:{one1:11}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 'one1', 11);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});



test('Setting a subobject of subobject', function(t) {
    var actionExpected = {one:{one1:{one11:111}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 'one1', {one11:111});
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Edititing a property of subobject', function(t) {
    var actionExpected = {one:{one1:{one11:'changed'}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one.one1, 'one11', 'changed');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Multiple changes of subobject', function(t) {
    var actionExpected = {one:{one1:{one12:112,one11:undefined}, one2:12}};
    var mutationsExpected = 3;

    var collector = dop.collect();
    del(objectServer.one.one1, 'one11');
    set(objectServer.one.one1, 'one12', 112);
    set(objectServer.one, 'one2', 12);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Editing a property of subobject and after removing the parent', function(t) {
    var actionExpected = {one:undefined};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer.one.one1, 'one12', 'changed!');
    del(objectServer, 'one');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});















test('Adding array', function(t) {
    var actionExpected = {one:[]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', []);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Adding with subarrays', function(t) {
    var actionExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Deleting and adding subarrays', function(t) {
    var actionExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 2;

    var collector = dop.collect();
    del(objectServer, 'one');
    set(objectServer, 'one', [1,2,[3,4]]);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Setting an object before array', function(t) {
    var actionExpected = {one:{}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', {});
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Setting an object after array', function(t) {
    var actionExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});




test('Pushing an item', function(t) {
    var actionExpected = {one:{"~dop":[[3,0,6]]}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    objectServer.one.push(6);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});




test('Setting an item of array', function(t) {
    var actionExpected = {one:{"~dop":[[2,1,'DOS']]}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 1, 'DOS');
    debugger
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});