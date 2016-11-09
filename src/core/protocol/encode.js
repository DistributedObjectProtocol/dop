
dop.core.encode = function(property, value) {

    var tof = typeof value;

    if (tof == 'function')
        return '~F';

    if (tof == 'undefined') // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        return '~U';

    if (value === Infinity)
        return '~I';

    if (value === -Infinity)
        return '~i';
    
    if (tof == 'number' && isNaN(value))
        return '~N';

    if (tof == 'object' && value instanceof RegExp)
        return '~R' + value.toString();

    if (tof == 'string' && value[0] === '~') // https://jsperf.com/charat-vs-index/5
        return '~'+value;

    return value;

};



// // Extending example
// (function() {
//     var encode = dop.core.encode;
//     dop.core.encode = function(property, value) {
//         if (typeof value == 'boolean')
//             return '~BOOL';
//         return encode(property, value);
//     };
// })();

