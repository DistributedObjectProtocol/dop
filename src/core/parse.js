

syncio.parse = function parse(data) {

    var that = this, tof;

    return JSON.parse(data, function(k, v) {

        tof = typeof v;

        if (v == that.stringify_undefined)
            return undefined;

        else if (tof == 'string') {

            if ( parse.parse_type_date.exec(v) )
                return new Date(v);

            else if ( v.substr(0, that.stringify_regexp.length) == that.stringify_regexp ) {
                var split = /\/(.+)\/([gmi]{0,3})/.exec(v.substr(that.stringify_regexp.length));
                return new RegExp(split[1], split[2]);
            }

        }

        return v;

    });

};
syncio.parse.parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse