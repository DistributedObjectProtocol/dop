var test = require('tape');
var dop = require('../dist/nodejs').create();
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;

var objectServer = dop.register({});
var arrayServer = dop.register([]);


function applyPatch(collector) {
    var patch = removeObjects(dop.core.getPatch(collector.mutations));
    var patchServer = decode(encode(patch));
    collector.destroy();
    if (patchServer[1])
        return patchServer[1].patch;
    else if (patchServer[2])
        return patchServer[2].patch;
    else
        return patchServer;
}
// helpers
function removeObjects(patchs) {
    for (var object_id in patchs)
        delete patchs[object_id].object;
    return patchs;
}

function maketest(t, patchGenerated, patchExpected, checkEncode) {
    console.log( '###', encode(patchGenerated) );
    t.deepEqual(patchGenerated, patchExpected, 'deepEqual');
    if (checkEncode!==false)
    t.equal(encode(patchGenerated), encode(patchExpected), 'equal');
    console.log( '' );
    t.end();
}


test('Adding property', function(t) {
    var patchExpected = {one:1};
    var mutationsExpected = 1;


    var collector = dop.collect();
    set(objectServer, 'one', 1);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Changing property', function(t) {
    var patchExpected = {one:11};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', 11);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, 1, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Changing property with the same value', function(t) {
    var patchExpected = {};
    var mutationsExpected = 0;

    var collector = dop.collect();
    set(objectServer, 'one', 11);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Deleting property', function(t) {
    var patchExpected = {one:undefined};
    var mutationsExpected = 1;

    var collector = dop.collect();
    del(objectServer, 'one');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});

test('Change and delete a removed item', function(t) {
    var patchExpected = {two:2,one:undefined};
    var mutationsExpected = 3;

    var collector = dop.collect();
    set(objectServer, 'one', 'Changeddd');
    del(objectServer, 'one');
    set(objectServer, 'two', 2);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Setting a subobject', function(t) {
    var patchExpected = {one:{}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', {});
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});



test('Setting a subobject', function(t) {
    var patchExpected = {one:{one1:11}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 'one1', 11);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});



test('Setting a subobject of subobject', function(t) {
    var patchExpected = {one:{one1:{one11:111}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 'one1', {one11:111});
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Edititing a property of subobject', function(t) {
    var patchExpected = {one:{one1:{one11:'changed'}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one.one1, 'one11', 'changed');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Multiple changes of subobject', function(t) {
    var patchExpected = {one:{one1:{one12:112,one11:undefined}, one2:12}};
    var mutationsExpected = 3;

    var collector = dop.collect();
    del(objectServer.one.one1, 'one11');
    set(objectServer.one.one1, 'one12', 112);
    set(objectServer.one, 'one2', 12);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Editing a property of subobject and after removing the parent', function(t) {
    var patchExpected = {one:undefined};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer.one.one1, 'one12', 'changed!');
    del(objectServer, 'one');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});















test('Adding array', function(t) {
    var patchExpected = {one:[]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', []);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Adding with subarrays', function(t) {
    var patchExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Deleting and adding subarrays', function(t) {
    var patchExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 2;

    var collector = dop.collect();
    del(objectServer, 'one');
    set(objectServer, 'one', [1,2,[3,4]]);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Setting an object before array', function(t) {
    var patchExpected = {one:{}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', {});
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Setting an object after array', function(t) {
    var patchExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});

test('Setting an array and pushing changes', function(t) {
    var patchExpected = {one:[0,2,[3,4],5]};
    var mutationsExpected = 3;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    set(objectServer.one, 0, 0);
    objectServer.one.push(5);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Pushing an item', function(t) {
    var patchExpected = {one:{"~DOP":[[1,4,0,7]]}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    objectServer.one.push(7);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});




test('Setting an item of array', function(t) {
    var patchExpected = {one:{"~DOP":[[1,1,1,'DOS']]}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 1, 'DOS');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Setting a subobject into an array', function(t) {
    var patchExpected = {"one":{"2":{"~DOP":[[2,3],[1,2,1,{}]]}}};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer.one[2], 2, {});
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});

test('Setting a property of a subobject that is into an array', function(t) {
    var patchExpected = {"one":{"2":{"2":{the:"end"}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one[2][2], 'the', 'end');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Setting a property of a subobject that is into an array', function(t) {
    var patchExpected = {"one":{"2":{"2":{array:['lol']}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one[2][2], 'array', ['lol']);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Pushing an item of a subarray that is into an array', function(t) {
    var patchExpected = {"one":{"2":{"2":{"array":{"~DOP":[[1,1,0,"xD"]]}}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    objectServer.one[2][2].array.push('xD');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Setting a array internaly', function(t) {
    var patchExpected = {"one":{"2":{"2":{"array":["lol","xD"]}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one[2][2], 'array', ['lol','xD']);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Pushing items and changing properties internaly', function(t) {
    var patchExpected = {one:{3:{2:{array:{"~DOP":[[2,3],[1,2,1,"juas"],[1,3,0,"omg"]]}}},"~DOP":[[1,5,0,"omg"],[0,0,5,1,4,2,3]]},two:undefined};
    var mutationsExpected = 6;

    var collector = dop.collect();
    set(objectServer.one[2][2].array, 2, 'juas');
    objectServer.one[2][2].array.push('omg');
    objectServer.one.push('omg');
    objectServer.one.reverse();
    del(objectServer, 'two');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});






//////////
// ARRAYS
//////////


test('Setting a property literaly', function(t) {
    var patchExpected = {"~DOP":[[2,1],[1,0,1,"testing"]]};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(arrayServer, 0, 'testing');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Pushing a property', function(t) {
    var patchExpected = {"~DOP":[[1,1,0,"second"]]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    arrayServer.push('second');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});

test('Adding a subobject', function(t) {
    var patchExpected = {"~DOP":[[1,2,0,{"obj":123}]]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    arrayServer.push({obj:123});
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test('Shift and editing subobject', function(t) {
    var patchExpected = {"1":{"prop":456},"~DOP":[[1,0,1]]};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(arrayServer[2], 'prop', 456);
    arrayServer.shift();
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});



test('Pushing literal arrays', function(t) {
    var patchExpected = {"1":{"prop":["my","array"]},"~DOP":[[1,2,0,[7,8,[9,10]],11],[1,0,1,"first"]]};
    var mutationsExpected = 3;

    var collector = dop.collect();
    arrayServer.push([7,8,[9,10]],11);
    set(arrayServer[1], 'prop', ['my','array']);
    set(arrayServer, 0, 'first');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});



