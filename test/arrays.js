
var dop = require('../dist/nodejs');
var Combinatorics = require('js-combinatorics');
var test = require('tape');
// // require('tabe').createStream( test );



function gify(obj) {
    this.prop=123;
    return JSON.stringify(obj);
}




test('for (i in ...) must return only array values', function(t) {
    var register = dop.register(array.slice(0));
    t.equal(gify(Object.keys(register)), gify(Object.keys(array)));
    t.end();
});





test('Splice', function(t) {
    argsCases.forEach(function(paramsCase) {
        var register = dop.register(array.slice(0));
        var original = array.slice(0);
        var description = JSON.stringify(paramsCase);
        t.equal(gify(register.splice.apply(register, paramsCase)), gify(original.splice.apply(original, paramsCase)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);

        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (dop.util.isObjectPlain(item)) {

                if (dop.isRegistered(item)) {
                    var object_dop = dop.getObjectDop(item);
                    t.equal(Number(object_dop[object_dop.length-1]), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    });
    t.end();
});



test('Shift', function(t) {
    var register = dop.register(array.slice(0));
    var original = array.slice(0);
    do {
        var description = original.length;
        t.equal(gify(register.shift.apply(register)), gify(original.shift.apply(original)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);
        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (dop.util.isObjectPlain(item)) {

                if (dop.isRegistered(item)) {
                    var object_dop = dop.getObjectDop(item);
                    t.equal(Number(object_dop[object_dop.length-1]), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    } while(original.length>0);

    t.end();
});



test('Pop', function(t) {
    var register = dop.register(array.slice(0));
    var original = array.slice(0);
    do {
        var description = original.length;
        t.equal(gify(register.pop.apply(register)), gify(original.pop.apply(original)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);
        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (dop.util.isObjectPlain(item)) {

                if (dop.isRegistered(item)) {
                    var object_dop = dop.getObjectDop(item);
                    t.equal(Number(object_dop[object_dop.length-1]), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
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
        var register = dop.register(array.slice(0));
        var original = array.slice(0);
        var description = JSON.stringify(paramsCase);
        t.equal(gify(register.push.apply(register, paramsCase)), gify(original.push.apply(original, paramsCase)), 'output case: '+description);
        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (dop.util.isObjectPlain(item)) {

                if (dop.isRegistered(item)) {
                    var object_dop = dop.getObjectDop(item);
                    t.equal(Number(object_dop[object_dop.length-1]), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
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
        var register = dop.register(array.slice(0));
        var original = array.slice(0);
        var description = JSON.stringify(paramsCase);
        t.equal(gify(register.unshift.apply(register, paramsCase)), gify(original.unshift.apply(original, paramsCase)), 'output case: '+description);
        t.equal(gify(original), gify(register), 'stringify case: '+description);
        t.deepEqual(original,register, 'deepEqual case: '+description);

        for (var index=0,total=register.length; index<total; ++index) {
            var item = register[index];
            if (dop.util.isObjectPlain(item)) {

                if (dop.isRegistered(item)) {
                    var object_dop = dop.getObjectDop(item);
                    t.equal(Number(object_dop[object_dop.length-1]), Number(index), 'correct path for subobject: '+index + ', Case:'+description);
                }
                else if (item.constructor === Object)
                    t.equal(false, true, 'object not registered: '+index + ', Case:'+description + ' ' + gify(item));
            }
        }
    });
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

var types = [0, 0, 1, 2, 12, 50, -1, -2, -12, -50, null, undefined, '', '0', '2', '50'];
var argsCases = [[]];
var single = types.map(function(item) {return [item]});
argsCases = argsCases.concat(single) 
var cmb = Combinatorics.combination(types, 2);
while(a = cmb.next()) argsCases.push(a, a.concat({},'string',{},1,null,undefined,new Date(),/test/,new gify(),true,{},[{}]));

