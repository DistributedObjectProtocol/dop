

dop.onsync = function( name, object, options ) {

    if ( dop.util.typeof(dop.data.object_name[name]) == 'object' )
        throw Error(dop.core.error.api.OBJECT_NAME_REGISTERED);

    // Storing object name
    dop.data.object_name[name] = {};

    if ( typeof object == 'function' ) {
        dop.data.object_name[name].callback = object;
    }

    // else {

    //     dop.data.object_name[name].permissions = dop.protocol.encodePermissions(options.writable, options.extendible);
    //     dop.data.object_name[name].asyncawait = options.asyncawait;
    //     dop.data.object_name[name].callback = false;
    //     var proxy = dop.core.registerObject( object, 2 );
    //     dop.data.object_name[name].object_id = proxy[dop.key_object_path][0];
    //     return proxy;
    // }

};