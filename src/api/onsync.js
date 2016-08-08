
dop.onsync = function( name, object_callback, options ) {

    if ( dop.util.typeof(dop.data.object_onsync[name]) == 'object' )
        throw Error(dop.core.error.api.OBJECT_NAME_REGISTERED);

    // When onsync is based on function to provide different object anytime
    if ( typeof object_callback == 'function' )
        dop.data.object_onsync[name] = {callback: object_callback};

    // When onsync is based on a specific object
    else {}

};