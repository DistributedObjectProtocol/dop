
dop.onsync = function( name, object, options ) {

    if ( dop.util.typeof(dop.data.object_onsync[name]) == 'object' )
        throw Error(dop.core.error.api.OBJECT_NAME_REGISTERED);

    // Storing object name
    dop.data.object_onsync[name] = {};

    // When onsync is based on function to provide different object anytime
    if ( typeof object == 'function' ) {
        dop.data.object_onsync[name].callback = object;
    }

    // When onsync is based on a specific object
    else {}

};