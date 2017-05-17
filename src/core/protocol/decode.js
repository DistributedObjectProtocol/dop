var regexpdate = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/,
    regexpsplit = /\/(.+)\/([gimuy]{0,5})/;

dop.core.decode = function(property, value, node, undefineds) {

    if (typeof value == 'string') {

        if (value == dop.protocol.instructionsPatchs.function)
            return dop.core.createRemoteFunction(node);

        if (value == dop.protocol.instructionsPatchs.undefined && isObject(undefineds)) {
            undefineds.push([this, property]); // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
            return undefined;
        }

        if (value == dop.protocol.instructionsPatchs.infinity)
            return Infinity;

        if (value == dop.protocol.instructionsPatchs._infinity)
            return -Infinity;

        if (value == dop.protocol.instructionsPatchs.nan)
            return NaN;

        if (regexpdate.exec(value))
            return new Date(value);

        if (value.substr(0,2) == dop.protocol.instructionsPatchs.regex) {
            var split = regexpsplit.exec(value.substr(2)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
            return new RegExp(split[1], split[2]);
        }

        if (value[0] == '~') // https://jsperf.com/charat-vs-index/5
            return value.substring(1);


    }

    return value;

};

