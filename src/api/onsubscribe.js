
dop.onsubscribe = function( name, object_callback, options ) {

    if ( dop.util.typeof(dop.data.object_onsubscribe[name]) == 'object' )
        throw Error(dop.core.error.api.OBJECT_NAME_REGISTERED);

    // When onsubscribe is based on function to provide different object anytime
    if ( typeof object_callback == 'function' )
        dop.data.object_onsubscribe[name] = object_callback;

    // When onsubscribe is based on a specific object
    else {
        var proxy = dop.core.registerObject(object_callback, false, options ),
            object_id = proxy[dop.specialkey.object_path][0];
        dop.data.object_onsubscribe[name] = object_id;
    }

};