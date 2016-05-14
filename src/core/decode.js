

dop.core.decode = function (node, data) {

    var encode_options = node.encode_options || dop.encode_options;

    return JSON.parse(data, function(k, v) {

        if ( typeof v == 'string' ) {

            if ( v == encode_options.encode_undefined )
                return undefined;

            else if ( dop.core.decode.decode_type_date.exec(v) )
                return new Date(v);

            else if ( v.substr(0, encode_options.encode_regexp.length) == encode_options.encode_regexp ) {
                var split = /\/(.+)\/([gimuy]{0,5})/.exec(v.substr(node.options.encode_regexp.length)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
                return new RegExp(split[1], split[2]);
            }

        }

        return v;

    });

};
dop.core.decode.decode_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse