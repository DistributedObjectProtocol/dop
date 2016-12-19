
dop.core.encodeUtil = function(property, value) {

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


// // Extending example
// var encode = dop.core.encodeUtil;
// dop.core.encodeUtil = function(property, value) {
//     if (typeof value == 'boolean')
//         return '~BOOL';
//     return encode(property, value);
// };

