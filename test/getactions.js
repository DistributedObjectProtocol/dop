var test = require('tape');
var dop = require('../dist/nodejs').create();
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;

var objectServer = dop.register({});
var arrayServer = dop.register([]);


function applyAction(collector) {
    var action = removeObjects(dop.core.getAction(collector.mutations));
    var actionServer = decode(encode(action));
    collector.destroy();
    if (actionServer[1])
        return actionServer[1].action;
    else if (actionServer[2])
        return actionServer[2].action;
    else
        return actionServer;
}
// helpers
function removeObjects(actions) {
    for (var object_id in actions)
        delete actions[object_id].object;
    return actions;
}

function maketest(t, actionGenerated, actionExpected, checkEncode) {
    console.log( '###', encode(actionGenerated) );
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

test('Setting an array and pushing changes', function(t) {
    var actionExpected = {one:[0,2,[3,4],5]};
    var mutationsExpected = 4;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    set(objectServer.one, 0, 0);
    objectServer.one.push(5);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Pushing an item', function(t) {
    var actionExpected = {one:{"~DOP":[[1,4,0,7]],length:5}};
    var mutationsExpected = 2;

    var collector = dop.collect();
    objectServer.one.push(7);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});




test('Setting an item of array', function(t) {
    var actionExpected = {one:{"~DOP":[[1,1,1,'DOS']]}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 1, 'DOS');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Setting a subobject into an array', function(t) {
    var actionExpected = {"one":{"2":{"~DOP":[[1,2,1,{}]],length:3}}};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer.one[2], 2, {});
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});

test('Setting a property of a subobject that is into an array', function(t) {
    var actionExpected = {"one":{"2":{"2":{the:"end"}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one[2][2], 'the', 'end');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Setting a property of a subobject that is into an array', function(t) {
    var actionExpected = {"one":{"2":{"2":{array:['lol']}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one[2][2], 'array', ['lol']);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Pushing an item of a subarray that is into an array', function(t) {
    var actionExpected = {"one":{"2":{"2":{"array":{"~DOP":[[1,1,0,"xD"]],"length":2}}}}};
    var mutationsExpected = 2;

    var collector = dop.collect();
    objectServer.one[2][2].array.push('xD');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Setting a array internaly', function(t) {
    var actionExpected = {"one":{"2":{"2":{"array":["lol","xD"]}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one[2][2], 'array', ['lol','xD']);
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Pushing items and changing properties internaly', function(t) {
    var actionExpected = {one:{3:{2:{array:{"~DOP":[[1,2,1,"juas"],[1,3,0,"omg"]],length:4}}},"~DOP":[[1,5,0,"omg"],[0,0,5,1,4,2,3]],length:6},two:undefined};
    var mutationsExpected = 8;

    var collector = dop.collect();
    set(objectServer.one[2][2].array, 2, 'juas');
    objectServer.one[2][2].array.push('omg');
    objectServer.one.push('omg');
    objectServer.one.reverse();
    del(objectServer, 'two');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});






//////////
// ARRAYS
//////////


test('Setting a property literaly', function(t) {
    var actionExpected = {"~DOP":[[1,0,1,"testing"]],length:1};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(arrayServer, 0, 'testing');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Pushing a property', function(t) {
    var actionExpected = {"~DOP":[[1,1,0,"second"]],length:2};
    var mutationsExpected = 2;

    var collector = dop.collect();
    arrayServer.push('second');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});

test('Adding a subobject', function(t) {
    var actionExpected = {"~DOP":[[1,2,0,{"obj":123}]],length:3};
    var mutationsExpected = 2;

    var collector = dop.collect();
    arrayServer.push({obj:123});
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});


test('Shift and editing subobject', function(t) {
    var actionExpected = {"1":{"prop":456},"~DOP":[[1,0,1]],length:2};
    var mutationsExpected = 3;

    var collector = dop.collect();
    set(arrayServer[2], 'prop', 456);
    arrayServer.shift();
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});



test('Pushing literal arrays', function(t) {
    var actionExpected = {"1":{"prop":["my","array"]},"~DOP":[[1,2,0,[7,8,[9,10]],11],[1,0,1,"first"]],length:4};
    var mutationsExpected = 4;

    var collector = dop.collect();
    arrayServer.push([7,8,[9,10]],11);
    set(arrayServer[1], 'prop', ['my','array']);
    set(arrayServer, 0, 'first');
    var actionGenerated = applyAction(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, actionGenerated, actionExpected);
});



