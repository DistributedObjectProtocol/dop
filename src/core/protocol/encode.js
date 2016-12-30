
dop.core.encode = function(property, value) {

    var tof = typeof value;

    if (tof == 'undefined') // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        return '~U';

    if (tof == 'string' && value[0] == '~')
        return '~'+value;
    
    if (tof == 'number' && isNaN(value))
        return '~N';

    if (tof == 'object' && value instanceof RegExp)
        return '~R' + value.toString();

    if (value === Infinity)
        return '~I';

    if (value === -Infinity)
        return '~i';

    return value;
};


// // Extending example
// var encode = dop.core.encodeUtil;
// dop.core.encodeUtil = function(property, value) {
//     if (typeof value == 'boolean')
//         return '~BOOL';
//     return encode(property, value);
// };

