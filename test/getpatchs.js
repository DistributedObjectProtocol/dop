var test = require('tape');
var dop = require('../dist/nodejs').create();
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;

var objectServer = dop.register({});
var arrayServer = dop.register({array:[]});


function applyPatch(collector) {
    var patch = dop.core.getPatch(collector.mutations);
    var patchServer = decode(encode(patch));
    collector.destroy();
    if (patchServer[1])
        return patchServer[1].patch;
    else if (patchServer[2])
        return patchServer[2].patch;
    else
        return patchServer;
}


function maketest(t, patchGenerated, patchExpected, checkEncode) {
    console.log( '###', encode(patchGenerated) );
    t.deepEqual(patchGenerated, patchExpected, 'deepEqual');
    if (checkEncode!==false)
    t.equal(encode(patchGenerated), encode(patchExpected), 'equal');
    console.log( '' );
    t.end();
}

var header = '\n\r\n\r\n\r--- ';


test(header+'Adding property', function(t) {
    var patchExpected = {one:1};
    var mutationsExpected = 1;


    var collector = dop.collect();
    set(objectServer, 'one', 1);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Changing property', function(t) {
    var patchExpected = {one:11};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', 11);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, 1, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Changing property with the same value', function(t) {
    var patchExpected = {};
    var mutationsExpected = 0;

    var collector = dop.collect();
    set(objectServer, 'one', 11);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Deleting property', function(t) {
    var patchExpected = {one:undefined};
    var mutationsExpected = 1;

    var collector = dop.collect();
    del(objectServer, 'one');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});

test(header+'Change and delete a removed item', function(t) {
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


test(header+'Setting a subobject', function(t) {
    var patchExpected = {one:{"~DOP":{deep:true}}};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer, 'one', {});
    set(objectServer.one, 'deep', true);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});



test(header+'Setting a subobject', function(t) {
    var patchExpected = {one:{one1:11}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 'one1', 11);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});



test(header+'Setting a subobject of subobject', function(t) {
    var patchExpected = {one:{one1:{"~DOP":{one11:111}}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 'one1', {one11:111});
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Edititing a property of subobject', function(t) {
    var patchExpected = {one:{one1:{one11:'changed'}}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one.one1, 'one11', 'changed');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Multiple changes of subobject', function(t) {
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


test(header+'Editing a property of subobject and after removing the parent', function(t) {
    var patchExpected = {one:undefined};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer.one.one1, 'one12', 'changed!');
    del(objectServer, 'one');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});












test(header+'Setting a new array', function(t) {
    var patchExpected = {one:[]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', []);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Setting a new array with subarrays', function(t) {
    var patchExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,4]]);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Deleting and adding subarrays', function(t) {
    var patchExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 2;

    var collector = dop.collect();
    del(objectServer, 'one');
    set(objectServer, 'one', [1,2,[3,4]]);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});





test(header+'Setting an array changing inside properties', function(t) {
    var patchExpected = {one:[11,2,[3,{a:44}]]};
    var mutationsExpected = 3;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3,{a:4}]]);
    set(objectServer.one, 0, 11);
    set(objectServer.one[2][1], 'a', 44);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


test(header+'Setting an array and pushing', function(t) {
    var patchExpected = {one:[1,2,3]};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2]);
    objectServer.one.push(3);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});



test(header+'Setting an array and pushing inside', function(t) {
    var patchExpected = {one:[1,2,[3,4]]};
    var mutationsExpected = 2;

    var collector = dop.collect();
    set(objectServer, 'one', [1,2,[3]]);
    objectServer.one[2].push(4);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});

test(header+'Pushing an item', function(t) {
    var patchExpected = {one:{"~DOP":[[1,3,0,7]]}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    objectServer.one.push(7);
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});




test(header+'Setting an item of array', function(t) {
    var patchExpected = {one:{"~DOP":[[1,1,1,'DOS']]}};
    var mutationsExpected = 1;

    var collector = dop.collect();
    set(objectServer.one, 1, 'DOS');
    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});


// test(header+'Setting a subobject into an array', function(t) {
//     var patchExpected = {"one":{"2":{"~DOP":[[2,3],[1,2,1,{}]]}}};
//     var mutationsExpected = 2;

//     var collector = dop.collect();
//     set(objectServer.one[2], 2, {});
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });

// test(header+'Setting a property of a subobject that is into an array', function(t) {
//     var patchExpected = {"one":{"2":{"2":{the:"end"}}}};
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     set(objectServer.one[2][2], 'the', 'end');
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Setting a property of a subobject that is into an array', function(t) {
//     var patchExpected = {"one":{"2":{"2":{array:['lol']}}}};
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     set(objectServer.one[2][2], 'array', ['lol']);
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Pushing an item of a subarray that is into an array', function(t) {
//     var patchExpected = {"one":{"2":{"2":{"array":{"~DOP":[[1,1,0,"xD"]]}}}}};
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     objectServer.one[2][2].array.push('xD');
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Setting a array internaly', function(t) {
//     var patchExpected = {"one":{"2":{"2":{"array":["lol","xD"]}}}};
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     set(objectServer.one[2][2], 'array', ['lol','xD']);
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Pushing items and changing properties internaly', function(t) {
//     var patchExpected = {one:{3:{2:{array:{"~DOP":[[2,3],[1,2,1,"juas"],[1,3,0,"omg"]]}}},"~DOP":[[1,5,0,"omg"],[0,0,5,1,4,2,3]]},two:undefined};
//     var mutationsExpected = 6;

//     var collector = dop.collect();
//     set(objectServer.one[2][2].array, 2, 'juas');
//     objectServer.one[2][2].array.push('omg');
//     objectServer.one.push('omg');
//     objectServer.one.reverse();
//     del(objectServer, 'two');
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });






// //////////
// // ARRAYS
// //////////


// test(header+'Setting a property literaly', function(t) {
//     var patchExpected = {"~DOP":[[2,1],[1,0,1,"testing"]]};
//     var mutationsExpected = 2;

//     var collector = dop.collect();
//     set(arrayServer.array, 0, 'testing');
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Pushing a property', function(t) {
//     var patchExpected = {"~DOP":[[1,1,0,"second"]]};
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     arrayServer.array.push('second');
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });

// test(header+'Adding a subobject', function(t) {
//     var patchExpected = {"~DOP":[[1,2,0,{"obj":123}]]};
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     arrayServer.array.push({obj:123});
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Shift and editing subobject', function(t) {
//     var patchExpected = {"1":{"prop":456},"~DOP":[[1,0,1]]};
//     var mutationsExpected = 2;

//     var collector = dop.collect();
//     set(arrayServer.array[2], 'prop', 456);
//     arrayServer.array.shift();
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });



// test(header+'Pushing literal arrays', function(t) {
//     var patchExpected = {"1":{"prop":["my","array"]},"~DOP":[[1,2,0,[7,8,[9,10]],11],[1,0,1,"first"]]};
//     var mutationsExpected = 3;

//     var collector = dop.collect();
//     arrayServer.array.push([7,8,[9,10]],11);
//     set(arrayServer.array[1], 'prop', ['my','array']);
//     set(arrayServer.array, 0, 'first');
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });



