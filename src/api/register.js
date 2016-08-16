
dop.register = function( object, options ) {

    var object_id;

    // Default options
    options = dop.util.merge({makeProxy:true}, options);

    // Already registered
    if ( object.hasOwnProperty(dop.specialkey.object_path) )
        object_id = object[dop.specialkey.object_path][0];

    // Not registered yet
    else {
        object_id = dop.data.object_inc++;
        object = dop.core.configureObject( object, [object_id], options.makeProxy );
    }

    // Not stored
    if ( dop.data.object[object_id] === undefined )
        dop.data.object[object_id] = {
            object: object,
            options: options,
            nodes: 0,
            node: {}
        };


    return object_id;

};
