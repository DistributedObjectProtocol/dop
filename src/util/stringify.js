

syncio.stringify = function( data ) {

    return JSON.stringify( data, syncio.stringify.callback );

};

syncio.stringify.type_function = '$f';
syncio.stringify.type_binary = '$b';
syncio.stringify.callback = function (k, v){

    if (typeof v == 'function')
        return syncio.stringify.type_function;
    
    return v;
};