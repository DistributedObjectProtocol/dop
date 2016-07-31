
dop.core.decode = (function(){

    var regexpdate = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/,
        regexpsplit = /\/(.+)\/([gimuy]{0,5})/;

    return function(k, v) {

        if ( typeof v == 'string' ) {

            if ( v === '~F' )
                return dop.core.remoteFunction.bind(this, k);

            else if ( v === '~I' )
                return Infinity;

            else if ( v === '~i' )
                return -Infinity;

            else if ( v === '~N' )
                return NaN;

            else if ( regexpdate.exec(v) )
                return new Date(v);

            else if ( v.substr(0,2) == '~R' ) {
                var split = regexpsplit.exec(v.substr(2)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
                return new RegExp(split[1], split[2]);
            }

            // else if ( v == '~U' )
                // return null; // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined

        }

        return v;

    };

})();