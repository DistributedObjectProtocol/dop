

syncio.parse = function( data ) {

    return JSON.parse( data, syncio.parse_callback );

};

syncio.parse_type_date = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/; //http://jsperf.com/serializing-date-on-json-parse
syncio.parse_callback = function (k, v) {
        
    //http://jsperf.com/serializing-date-on-json-parse
    if ( typeof v === 'string' ) {
        var regexp = syncio.parse_type_date.exec(v);
        if ( regexp )
            return new Date(v);
    }

    return v;

};