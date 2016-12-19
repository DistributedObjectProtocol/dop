
dop.core.encodeProtocol = function(property, value) {

    var tof = typeof value;

    if (tof == 'function')
        return '~F';

    if (tof == 'undefined') // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        return '~U';

    return value;
};