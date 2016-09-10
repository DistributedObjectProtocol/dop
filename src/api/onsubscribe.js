
dop.onsubscribe = function( callback ) {
    if ( typeof callback == 'function' )
        dop.data.onsubscribe = callback;
    else
        throw Error( dop.core.error.api.ONSUBSCRIBE_NOFUNCTION );
};