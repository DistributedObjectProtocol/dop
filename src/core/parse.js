

dop.core.parse = function (listener, data) {

    var listener = this;

    return JSON.parse(data, function(k, v) {

        if ( typeof v == 'string' ) {

            if ( v == listener.options.stringify_undefined )
                return undefined;

            else if ( dop.core.parse.parse_type_date.exec(v) )
                return new Date(v);

            else if ( v.substr(0, listener.options.stringify_regexp.length) == listener.options.stringify_regexp ) {
                var split = /\/(.+)\/([gimuy]{0,5})/.exec(v.substr(listener.options.stringify_regexp.length)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
                return new RegExp(split[1], split[2]);
            }

        }

        return v;

    });

};
dop.core.parse.parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse