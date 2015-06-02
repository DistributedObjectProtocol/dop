

syncio.stringify = function( data ) {

    return JSON.stringify( data, syncio.stringify_callback );

};

syncio.stringify_type_function = '$f';
syncio.stringify_type_binary = '$b';
syncio.stringify_callback = function (k, v){

    if (typeof v == 'function')
        return syncio.stringify_type_function;
    
    return v;
};