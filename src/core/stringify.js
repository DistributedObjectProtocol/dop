

syncio.api.prototype.stringify = function( data ) {

    var key_remote_function = this.key_remote_function;

    return JSON.stringify( data, function (k, v){

        if ( typeof v == 'function' && v.name !== key_remote_function )
            return key_remote_function;
        
        return v;
    });

};