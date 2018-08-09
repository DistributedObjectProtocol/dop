dop.core.encode = function(property, value) {
    var tof = typeof value

    if (tof == 'undefined')
        // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        return dop.protocol.instructionsPatchs.undefined

    if (tof == 'string' && value[0] == '~') return '~' + value

    if (tof == 'number' && isNaN(value))
        return dop.protocol.instructionsPatchs.nan

    if (tof == 'object' && value instanceof RegExp)
        return dop.protocol.instructionsPatchs.regex + value.toString()

    if (value === Infinity) return dop.protocol.instructionsPatchs.infinity

    if (value === -Infinity) return dop.protocol.instructionsPatchs._infinity

    return value
}

// // Extending example
// var encode = dop.core.encodeUtil;
// dop.core.encodeUtil = function(property, value) {
//     if (typeof value == 'boolean')
//         return '~BOOL';
//     return encode(property, value);
// };
