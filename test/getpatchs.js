var test = require('tape');
var dop = require('../dist/nodejs').create();
var set = dop.set;
var del = dop.del;
var encode = dop.encode;
var decode = dop.decode;



function applyPatch(collector) {
    var patch = dop.core.getPatch(collector.mutations);
    var patchServer = decode(encode(patch));
    collector.destroy();
    for (var id in patchServer)
        return patchServer[id].chunks;
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


// test(header+'Adding property', function(t) {
//     var patchExpected = [{one:1}];
//     var mutationsExpected = 1;


//     var collector = dop.collect();
//     set(objectServer, 'one', 1);
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Changing property', function(t) {
//     var patchExpected = [{one:11}];
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     set(objectServer, 'one', 11);
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, 1, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Changing property with the same value', function(t) {
//     var patchExpected = [{}];
//     var mutationsExpected = 0;

//     var collector = dop.collect();
//     set(objectServer, 'one', 11);
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });


// test(header+'Deleting property', function(t) {
//     var patchExpected = [{one:undefined}];
//     var mutationsExpected = 1;

//     var collector = dop.collect();
//     del(objectServer, 'one');
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });

// test(header+'Change and delete a removed item', function(t) {
//     var patchExpected = [{two:2,one:undefined}];
//     var mutationsExpected = 3;

//     var collector = dop.collect();
//     set(objectServer, 'one', 'Changeddd');
//     del(objectServer, 'one');
//     set(objectServer, 'two', 2);
//     var patchGenerated = applyPatch(collector);
//     t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
//     maketest(t, patchGenerated, patchExpected);
// });














test(header+'Setting an array and mutating it', function(t) {
    var object = dop.register({});
    var collector = dop.collect();
    

    var patchExpected = [{"array":[2,["c","b",{"B1":"string"},false,true]]}];
    var mutationsExpected = 5;
    set(object, 'array', [true,false]);
    object.array.push('a','b','c')
    set(object.array, 2, {B1:[true,false]});
    object.array.reverse()
    set(object.array[2], 'B1', 'string');


    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});






test(header+'Mutating array then mutating nested objects', function(t) {
    var object = dop.register({array:[true,false]});
    var collector = dop.collect();
    

    var patchExpected = [{"array":[4,[0,1]]},{"array":{"2":[2,{"B1":false}],"length":3}}];
    var mutationsExpected = 3;
    object.array.reverse();
    set(object.array, 2, {B1:false});



    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});





test(header+'Mutating nested objects then mutating parent array', function(t) {
    var object = dop.register({array:[true,false]});
    var collector = dop.collect();
    

    var patchExpected = [{"array":{"2":[2,{"B1":false}],"length":3}},{"array":[4,[0,2]]}];
    var mutationsExpected = 3;
    set(object.array, 2, {B1:false});
    object.array.reverse();



    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
});





test(header+'Mutating array twice', function(t) {
    var object = dop.register({array:[3,1,2]});
    var collector = dop.collect();
    

    var patchExpected = [{"array":[[3,[3,0,5,4,6]],[4,[0,1,1,2,3,4]]]}];
    var mutationsExpected = 2;
    object.array.push(5,4,6);
    object.array.sort();


    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);

})




test(header+'Mutating array and mutating array deeper', function(t) {
    var object = dop.register({array:[true,false,[true,false]]});
    var collector = dop.collect();
    

    var patchExpected = [{"array":[4,[0,2]]},{"array":{"0":[4,[0,1]]}}];
    var mutationsExpected = 2;
    object.array.reverse();
    object.array[0].reverse();


    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);

})



test(header+'Mutating array deeper and mutating container', function(t) {
    var object = dop.register({array:[true,false,[true,false]]});
    var collector = dop.collect();
    

    var patchExpected = [{"array":{"2":[4,[0,1]]}},{"array":[4,[0,2]]}];
    var mutationsExpected = 2;
    object.array[2].reverse();
    object.array.reverse();


    var patchGenerated = applyPatch(collector);
    t.equal(collector.mutations.length, mutationsExpected, 'Mutations expecteds: '+collector.mutations.length);
    maketest(t, patchGenerated, patchExpected);
})
