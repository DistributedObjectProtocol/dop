

syncio.wrap = {

    type_function: '{f}',
    type_date: /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/, //http://jsperf.com/serializing-date-on-json-parse


    stringify: function (k, v){

        if (typeof v == 'function')
            return syncio.protocol.type_function;
        
        return v;
    },

    parse: function (k, v) {
        
        //http://jsperf.com/serializing-date-on-json-parse
        if ( typeof v === 'string' ) {
            var regexp = syncio.protocol.type_date.exec(v);
            if ( regexp )
                return new Date(v);
        }

        return v;

    }


};