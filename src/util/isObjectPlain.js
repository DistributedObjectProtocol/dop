
dop.util.isObjectPlain = function(object) {
    if (!object)
        return false;
    var prototype = Object.getPrototypeOf(object);
    return (prototype === Object.prototype || prototype === Array.prototype);
};

// function Test(){}
// console.log(isObjectPlain(null));
// console.log(isObjectPlain({}));
// console.log(isObjectPlain(function(){}));
// console.log(isObjectPlain([]));
// console.log(isObjectPlain(1));
// console.log(isObjectPlain("s"));
// console.log(isObjectPlain(true));
// console.log(isObjectPlain(/a/));
// console.log(isObjectPlain(new Date()));
// console.log(isObjectPlain(Symbol('')));
// console.log(isObjectPlain(new Test));


// dop.util.isObjectPlain = function(object) {
//     var tof = dop.util.typeof(object);
//     return (tof == 'object' || tof == 'array');
// };
