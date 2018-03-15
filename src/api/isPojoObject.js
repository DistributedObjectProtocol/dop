dop.isPojoObject = function(object) {
    if (object === null || typeof object !== "object") return false;
    var prototype = Object.getPrototypeOf(object);
    return prototype === Object.prototype || prototype === Array.prototype;
};


// dop.isPojoObject = function(object) {
//     var tof = dop.util.typeof(object);
//     return (tof === 'object' || tof == 'array');
// };

// function Test(){}
// console.log(dop.isPojoObject({}));
// console.log(dop.isPojoObject([]));
// console.log(dop.isPojoObject(new Error));
// console.log(dop.isPojoObject(new Date()));
// console.log(dop.isPojoObject(null));
// console.log(dop.isPojoObject(Symbol('')));
// console.log(dop.isPojoObject(function(){}));
// console.log(dop.isPojoObject(1));
// console.log(dop.isPojoObject("s"));
// console.log(dop.isPojoObject(true));
// console.log(dop.isPojoObject(/a/));