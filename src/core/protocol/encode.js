dop={core:{}}
var data = {
    function: function(){},
    NaN: NaN,
    Infinity: -Infinity,
    undefined: undefined,

};
dop.core.encode1 = function(property, value) {

    var tof = typeof value;

    if (value === Infinity)
        return '~I';

    if (value === -Infinity)
        return '~i';
    
    if (tof == 'number' && isNaN(value))
        return '~N';

    if (tof == 'object' && value instanceof RegExp)
        return '~R' + value.toString();

    return value;

};
dop.core.encode2 = function(property, value) {

    var tof = typeof value;
    if (value === '~i')
        return 'LOOOL';
    if (tof == 'function')
        return '~F';

    if (tof == 'undefined') // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        return '~U';

    if (tof == 'string' && value[0] === '~') // https://jsperf.com/charat-vs-index/5
        return '~'+value;

    return value;

};



encode = function(data, encoders) {
    var length = encoders.length;
    return JSON.stringify(data, function recursion(property, value, index) {
        if (index === undefined)
            index = 0;
        if (index<length) {
            value = encoders[index](property, value);
            return (index<length-1) ? recursion(property, value, index+1) : value;
        }
    })
}

console.log(encode(data, [dop.core.encode1,dop.core.encode2]));


// // Extending example
// (function() {
//     var encode = dop.core.encode;
//     dop.core.encode = function(property, value) {
//         if (typeof value == 'boolean')
//             return '~BOOL';
//         return encode(property, value);
//     };
// })();

