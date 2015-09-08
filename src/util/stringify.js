

syncio.stringify = function( data ) {

    return JSON.stringify( data, syncio.stringify_callback );

};

syncio.stringify_callback = function (k, v){

    if (typeof v == 'function')
        return syncio.remote_function;
    
    return v;
};