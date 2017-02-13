var regexpdate = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/,
    regexpsplit = /\/(.+)\/([gimuy]{0,5})/;

dop.core.decode = function(property, value, node, undefineds) {

    if (typeof value == 'string') {

        if (value == '~F')
            return dop.core.createRemoteFunction(node);

        if (value == '~U' && isObject(undefineds)) {
            undefineds.push([this, property]); // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
            return undefined;
        }

        if (value == '~I')
            return Infinity;

        if (value == '~i')
            return -Infinity;

        if (value == '~N')
            return NaN;

        if (regexpdate.exec(value))
            return new Date(value);

        if (value.substr(0,2) == '~R') {
            var split = regexpsplit.exec(value.substr(2)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
            return new RegExp(split[1], split[2]);
        }

        if (value[0] == '~') // https://jsperf.com/charat-vs-index/5
            return value.substring(1);


    }

    return value;

};

