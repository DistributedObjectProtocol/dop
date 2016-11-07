
dop.util.isObjectRegistrable = function(object) {
    var tof = dop.util.typeof(object);
    return (tof === 'object' || tof == 'array');
};

// function Test(){}
// console.log(isObjectRegistrable({}));
// console.log(isObjectRegistrable([]));
// console.log(isObjectRegistrable(new Test));
// console.log(isObjectRegistrable(new Date()));
// console.log(isObjectRegistrable(/a/));
// console.log(isObjectRegistrable(null));
// console.log(isObjectRegistrable(function(){}));
// console.log(isObjectRegistrable(1));
// console.log(isObjectRegistrable("s"));
// console.log(isObjectRegistrable(true));
// console.log(isObjectRegistrable(Symbol('')));
