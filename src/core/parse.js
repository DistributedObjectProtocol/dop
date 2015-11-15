
(function() {

    syncio.api.prototype.parse = function( data ) {

        return JSON.parse( data, parse_callback );

    };

    var parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse
    var parse_callback = function (k, v) {
            
        //http://jsperf.com/serializing-date-on-json-parse
        if ( typeof v === 'string' ) {
            var regexp = parse_type_date.exec(v);
            if ( regexp )
                return new Date(v);
        }

        return v;

    };

})();