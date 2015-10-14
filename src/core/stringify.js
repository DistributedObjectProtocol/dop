

syncio.stringify = function( data ) {

    var remote_function = this.remote_function;

    return JSON.stringify( data, function (k, v){

        if ( typeof v == 'function' && v.name !== remote_function )
            return syncio.remote_function;
        
        return v;
    });

};