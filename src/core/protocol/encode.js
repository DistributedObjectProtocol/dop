
dop.core.encode = function(property, value) {

    var tof = typeof value;

    if (tof == 'function')
        return '~F';

    else if (tof == 'undefined') // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        return '~U';

    else if (value === Infinity)
        return '~I';

    else if (value === -Infinity)
        return '~i';
    
    else if (tof == 'number' && isNaN(value))
        return '~N';

    else if (tof == 'object' && value instanceof RegExp)
        return '~R' + value.toString();

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

