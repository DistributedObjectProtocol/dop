
var dop = require('../dist/nodejs');
var test = require('tape');
// require('tabe').createStream( test );

function gify(obj) {
    this.prop=123;
    return JSON.stringify(obj);
}


var array = [
    [4,5,6,7],
    'string',
    true,
    -123,
    {},
    // NaN, // not working with deepEqual, cuz (NaN===NaN) -> false
    -Infinity,
    {},
    1.234153454354341,
    12313214234312324353454534534,
    {},
    undefined,
    null,
    {subobject:'value'},
    Symbol('sym'),
    {},
    new Date(),
    new gify(),
    /myregexp/g
];

var paramsCases = [
    [],
    [0],
    [1],
    [2],
    [-1],
    [-2],

    [0,0],
    [0,1],
    [0,2],
    [1,0],
    [1,1],
    [1,2],
    [2,0],
    [2,1],
    [2,2],

    [0,-1],
    [0,-2],
    [-1,0],
    [-1,-1],
    [-1,-2],
    [-2,0],
    [2,-1],
    [-2,-2],

    [0,0, {},'string',{},1,true,{},[]],
    [0,1, {},'string',{},1,true,{},[]],
    [0,2, {},'string',{},1,true,{},[]],
    [1,0, {},'string',{},1,true,{},[]],
    [1,1, {},'string',{},1,true,{},[]],
    [1,2, {},'string',{},1,true,{},[]],
    [2,0, {},'string',{},1,true,{},[]],
    [2,1, {},'string',{},1,true,{},[]],
    [2,2, {},'string',{},1,true,{},[]],

    [0,-1, {},'string',{},1,true,{},[]],
    [0,-2, {},'string',{},1,true,{},[]],
    [-1,0, {},'string',{},1,true,{},[]],
    [-1,-1, {},'string',{},1,true,{},[]],
    [-1,-2, {},'string',{},1,true,{},[]],
    [-2,0, {},'string',{},1,true,{},[]],
    [2,-1, {},'string',{},1,true,{},[]],
    [-2,-2, {},'string',{},1,true,{},[]],
];




test('for (i in ...) must return only array values', function(t) {
    var register = dop.register(array.slice(0));
    t.equal(gify(Object.keys(register)), gify(Object.keys(array)));
    t.end();
});





test('Splice', function(t) {
    paramsCases.forEach(function(paramsCase) {
        var register = dop.register(array.slice(0));
        var original = array.slice(0);
        var description = JSON.stringify(paramsCase);
        t.equal(gify(register.splice.apply(register, paramsCase)), gify(original.splice.apply(original, paramsCase)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);
        for (var index in register) {
            var item = register[index];
            if (dop.util.isObjectStandard(item)) {

                if (dop.isRegistered(item)) {
                    var object_dop = dop.getObjectDop(item);
                    t.equal(Number(index), Number(object_dop[object_dop.length-1]), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    });
    t.end();
});












// setTimeout(function() {console.clear();

// // INITIATION
// obj=dop.register({
//     prop:"prop",
//     arr:[1,2,{arr2:[2,3,{the:"end"}]}],
//     old:"old"
// })
// remote=dop.register(dop.util.merge({}, obj));
// console.log( JSON.stringify(obj) );
// console.log( JSON.stringify(remote) );

// {arr:[
//     [0,1], // splice
//     [0,-1] // swap
//     [1,{arr2:[[0,1]]}], // inner changes
// ]}


// // MUTATIONS COLLECT
// collector = dop.collect();
// obj.new='yeah';
// delete obj.old;
// obj.arr.shift();
// obj.arr[1].arr2.shift();
// action = collector.getAction();
// console.log( 'ACTION', JSON.stringify(action) );


// console.log('APLYING ACTION REMOTE')
// action[4] = action[3];
// delete action[3];
// dop.setAction(action);
// console.log( JSON.stringify(obj) );
// console.log( JSON.stringify(remote) );

// },1000)



// obj=dop.register({array:[1,[2,{i:3}]]})
// collector = dop.collect();
// // obj.new='yeah';
// // delete obj.old;
// obj.array.shift();
// // obj.splice(2,{last:9},'coca','cola');
// // obj.reverse();
// // obj.push(dop.register({registered:true}));
// obj.array[0].shift();
// obj.array[0][0].i=33;
// console.log( JSON.stringify(obj.array) );
// obj.array[0].push(4);
// obj.array.push([5]);
// // console.log( collector.getAction() );
// console.log( JSON.stringify(collector.getAction()[3]) );
