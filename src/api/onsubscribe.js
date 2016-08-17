
dop.onsubscribe = function( name, object_callback, options ) {

    // When onsubscribe is based on function to provide different object anytime
    if ( typeof object_callback.object == 'function' )
        dop.data.object_onsubscribe[name] = {object:object_callback};

    // When onsubscribe is based on a specific object
    else {
        var object = dop.register(object_callback, options ),
            object_id = dop.getObjectId(object);
        dop.data.object_onsubscribe[name] = {object:object,options:options};
    }

};