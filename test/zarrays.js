
var dop = require('./.proxy').create();
var Combinatorics = require('js-combinatorics');
var test = require('tape');
// // require('tabe').createStream( test );



function gify(obj) {
    this.myClassProperty=123;
    return JSON.stringify(obj);
}
var isPojoObject = dop.isPojoObject;



test('for (i in ...) must return only array values', function(t) {
    var object = dop.register({array:array.slice(0)});
    var register = object.array;
    t.equal(gify(Object.keys(register)), gify(Object.keys(array)));
    t.end();
});


test('Splice', function(t) {
    argsCases.forEach(function(paramsCase) {
        var object = dop.register({array:array.slice(0)});
        var register = object.array;
        var original = array.slice(0);
        var description = JSON.stringify(paramsCase);
        t.equal(gify(register.splice.apply(register, paramsCase)), gify(original.splice.apply(original, paramsCase)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);

        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (isPojoObject(item)) {

                if (dop.isRegistered(item)) {
                    var property = dop.getObjectProperty(item);
                    t.equal(Number(property), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    });
    t.end();
});



test('Shift', function(t) {
    var object = dop.register({array:array.slice(0)});
    var register = object.array;
    var original = array.slice(0);
    do {
        var description = original.length;
        t.equal(gify(register.shift.apply(register)), gify(original.shift.apply(original)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);
        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (isPojoObject(item)) {

                if (dop.isRegistered(item)) {
                    var property = dop.getObjectProperty(item);
                    t.equal(Number(property), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    } while(original.length>0);

    t.end();
});



test('Pop', function(t) {
    var object = dop.register({array:array.slice(0)});
    var register = object.array;
    var original = array.slice(0);
    do {
        var description = original.length;
        t.equal(gify(register.pop.apply(register)), gify(original.pop.apply(original)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);
        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (isPojoObject(item)) {

                if (dop.isRegistered(item)) {
                    var property = dop.getObjectProperty(item);
                    t.equal(Number(property), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    } while(original.length>0);

    t.end();
});



test('Push', function(t) {
    argsCases.forEach(function(paramsCase) {
        var object = dop.register({array:array.slice(0)});
        var register = object.array;
        var original = array.slice(0);
        var description = JSON.stringify(paramsCase);
        t.equal(gify(register.push.apply(register, paramsCase)), gify(original.push.apply(original, paramsCase)), 'output case: '+description);
        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (isPojoObject(item)) {

                if (dop.isRegistered(item)) {
                    var property = dop.getObjectProperty(item);
                    t.equal(Number(property), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    });
    t.end();
});




test('Unshift', function(t) {
    argsCases.forEach(function(paramsCase) {
        var object = dop.register({array:array.slice(0)});
        var register = object.array;
        var original = array.slice(0);
        var description = JSON.stringify(paramsCase);
        t.equal(gify(register.unshift.apply(register, paramsCase)), gify(original.unshift.apply(original, paramsCase)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);

        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (isPojoObject(item)) {

                if (dop.isRegistered(item)) {
                    var property = dop.getObjectProperty(item);
                    t.equal(Number(property), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    });
    t.end();
});


test('Reverse', function(t) {
    var object = dop.register({array:array.slice(0)});
    var register = object.array;
    var original = array.slice(0);
    t.equal(gify(register.reverse()), gify(original.reverse()), 'output case');
    t.equal(gify(original), gify(register), 'stringify case');
    t.deepEqual(original,register, 'deepEqual case');
    for (var index=0,total=register.length; index<total; ++index) {
        var item = register[index];
        if (isPojoObject(item)) {
            dop.getObjectPath(item);
            if (dop.isRegistered(item)) {
                var property = dop.getObjectProperty(item);
                t.equal(Number(property), Number(index), 'correct path for subobject: '+index + ', Case:');
            }
            else if (item.constructor === Object)
                t.equal(false, true, 'object not registered: '+index + ', Case:' + ' ' + gify(item));
        }
    }
    t.end();
});






test('Sort', function(t) {

    var arrayOriginal;
    var copy;
    var swaps;
    var compareFunctions = [
        undefined,
        function(a,b) {return a-b},
        function(a,b) {return b-a},
        function(a,b) {return a>b},
        function(a,b) {return b>a},
        function(a,b) {return a===b},
        function(a,b) {return 1},
        function(a,b) {return -1},
        function(a,b) {return 0},
        function(a,b) {
            if (a>b) return 1;
            if (b>a) return -1;
            return 0;
        },
        function(a,b) {
            if (String(a)>String(b)) return 1;
            if (String(b)>String(a)) return -1;
            return 0;
        }
    ];



    compareFunctions.forEach(function(compareFunction) {
        var arrayOriginal = types.slice(0);
        var copy = arrayOriginal.slice(0);
        arrayOriginal.sort(compareFunction);
        dop.core.sortDiff(arrayOriginal, copy);
        t.equal(gify(arrayOriginal), gify(copy), 'stringify');
        t.deepEqual(arrayOriginal, copy, 'deepEqual function:'+compareFunction);
        var objectRegistered = dop.register({array:array.slice(0)});
        arrayOriginal = objectRegistered.array;
        arrayOriginal[13] = true;
        copy = arrayOriginal.slice(0);
        arrayOriginal.sort(compareFunction);
        dop.core.sortDiff(arrayOriginal, copy);
        t.equal(gify(arrayOriginal), gify(copy), 'stringify');
        t.deepEqual(arrayOriginal, copy, 'deepEqual function:'+compareFunction);
        for (var index=0,total=arrayOriginal.length; index<total; ++index) {
            var item = arrayOriginal[index];
            if (isPojoObject(item)) {

                if (dop.isRegistered(item)) {
                    dop.getObjectPath(item);
                    var property = dop.getObjectProperty(item);
                    // if ( Number(property) !== Number(index) )
                        // debugger;
                    t.equal(Number(property), Number(index), 'correct path for subobject: '+index + ', Case:');
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:' + ' ' + gify(item));
            }
        }
    });


    var objectRegistered = dop.register({array:array.slice(0)});
    arrayOriginal = objectRegistered.array;
    arrayOriginal[13] = true;
    copy = arrayOriginal.slice(0);
    var output1 = arrayOriginal.sort();
    var output2 = copy.sort();
    t.equal(gify(output1), gify(output2), 'output');


    t.end();
});





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

var types = [0, 1, Infinity, -Infinity, 2, 12, 50, -1, -2, -12, -50, null, undefined, '', '0', '2', '50'];
var argsCases = [[]];
var single = types.map(function(item) {return [item]});
argsCases = argsCases.concat(single) 
var cmb = Combinatorics.baseN(types, 2);
while(a = cmb.next()) argsCases.push(a)//argsCases.push(a, a.concat({},'string',{},1,null,undefined,new Date(),/test/,new gify(),true,{},[{}]));

