var test = require('tape');
var dop = require('./.proxy').create();
var merge = require('lodash.merge');
var Combinatorics = require('js-combinatorics');



var objects = {}
objects.empty = function(){return {}}

objects.types = function(){return {
    string:'string',
    boolean:true,
    number:-123,
    Infinity:-Infinity,
    float:1.234153454354341,
    long:12313214234312324353454534534,
    null:null,
    // // from here breaks
    // undefined:undefined,
    // NaN:NaN,
    // symbol:Symbol('sym'),
    // date: new Date(),
    // regexp: /molamazo/g,
    // function: function(){console.log(arguments)}
}}
objects.obj1 = function(){return {
    a: 11,
    b: 12,
    array: [1,2,3,{abc:123}],
    d: {
        d1: 13,
        d2: {
            d21: 123,
            d22: {
                d221: 12,
                d223: { 
                  hola: 'hola',
                  undefined: 'undefined'
                }
            }
        }
    },
    arrobj: ['a','b','c','d'],
    f: 5,
    g: 123
}}
objects.obj2 = function(){return {
    b: 3,
    c: 5,
    obj: {lolo:111},
    // fun: function(){},
    arr: [1,2,3,{La:123}],
    array: [567],
    arrobj: {0:1,1:2},
    d: {
        d2: {
            d22: {
                d222: 25,
                d223: {
                  hola:'mundo',
                //   undefined: undefined // lodash ignores undefined values
                }
            }
        }
    }
}};

var all = ['empty', 'types', 'obj1', 'obj2']
var argsCases = [], cmb, a

for (var i=1; i<all.length; i++) {
    cmb = Combinatorics.baseN(all, i+1);
    while(a = cmb.next()) argsCases.push(a)//argsCases.push(a, a.concat({},'string',{},1,null,undefined,new Date(),/test/,new gify(),true,{},[{}]));
}


test('All cases', function(t) {

    for (i=0; i<argsCases.length; i++) {
        var data1 = argsCases[i].map(function(item) {
            return objects[item]()
        })
        var data2 = argsCases[i].map(function(item) {
            return objects[item]()
        })
        var o1 = dop.util.merge.apply(this, data1)
        var o2 = merge.apply(this, data2)
        t.deepEqual(o1, o2, argsCases[i].join('(), '))
    }

    t.end()
})


// test(' {}, obj1() ', function(t) {
//     var o1 = dop.util.merge({}, obj1())
//     var o2 = merge({}, obj1())
//     t.deepEqual(o1, o2)
//     t.end()
// })

// test(' {}, obj2() ', function(t) {
//     var o1 = dop.util.merge({}, obj2())
//     var o2 = merge({}, obj2())
//     t.deepEqual(o1, o2)
//     t.end()
// })


// test(' {}, types() ', function(t) {
//     var o1 = dop.util.merge({}, types())
//     var o2 = merge({}, types())
//     t.deepEqual(o1, o2)
//     t.end()
// })
















// test(' {}, obj1(), obj1() ', function(t) {
//     var o1 = dop.util.merge({}, obj1(), obj1())
//     var o2 = merge({}, obj1(), obj1())
//     t.deepEqual(o1, o2)
//     t.end()
// })

// // test(' {}, obj1(), obj2() ', function(t) {
// //     var o1 = dop.util.merge({}, obj1(), obj2())
// //     var o2 = merge({}, obj1(), obj2())
// //     t.deepEqual(o1, o2)
// //     t.end()
// // })


// test(' {}, obj1(), types() ', function(t) {
//     var o1 = dop.util.merge({}, obj1(), types())
//     var o2 = merge({}, obj1(), types())
//     t.deepEqual(o1, o2)
//     t.end()
// })








// test(' {}, obj2(), obj1() ', function(t) {
//     var o1 = dop.util.merge({}, obj2(), obj1())
//     var o2 = merge({}, obj2(), obj1())
//     t.deepEqual(o1, o2)
//     t.end()
// })

// test(' {}, obj2(), obj2() ', function(t) {
//     var o1 = dop.util.merge({}, obj2(), obj2())
//     var o2 = merge({}, obj2(), obj2())
//     t.deepEqual(o1, o2)
//     t.end()
// })


// test(' {}, obj2(), types() ', function(t) {
//     var o1 = dop.util.merge({}, obj2(), types())
//     var o2 = merge({}, obj2(), types())
//     t.deepEqual(o1, o2)
//     t.end()
// })






// test(' {}, types(), obj1() ', function(t) {
//     var o1 = dop.util.merge({}, types(), obj1())
//     var o2 = merge({}, types(), obj1())
//     t.deepEqual(o1, o2)
//     t.end()
// })

// test(' {}, types(), obj2() ', function(t) {
//     var o1 = dop.util.merge({}, types(), obj2())
//     var o2 = merge({}, types(), obj2())
//     t.deepEqual(o1, o2)
//     t.end()
// })


// test(' {}, types(), types() ', function(t) {
//     var o1 = dop.util.merge({}, types(), types())
//     var o2 = merge({}, types(), types())
//     t.deepEqual(o1, o2)
//     t.end()
// })
