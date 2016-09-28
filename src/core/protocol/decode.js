var regexpdate = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/,
    regexpsplit = /\/(.+)\/([gimuy]{0,5})/;

dop.core.decode = function(property, value) {

    if ( typeof value == 'string' ) {

        if ( value === '~F' )
            return dop.core.remoteFunction(this, property);

        else if ( value === '~I' )
            return Infinity;

        else if ( value === '~i' )
            return -Infinity;

        else if ( value === '~N' )
            return NaN;

        else if ( regexpdate.exec(value) )
            return new Date(value);

        else if ( value.substr(0,2) == '~R' ) {
            var split = regexpsplit.exec(value.substr(2)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
            return new RegExp(split[1], split[2]);
        }

        // else if ( value == '~U' )
            // return null; // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined

    }

    return value;

};
