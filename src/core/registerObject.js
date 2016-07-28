
dop.core.registerObject = function( node, object, owner, options ) {

    if ( !object.hasOwnProperty(dop.specialkey.object_path) ) {
        // Getting id to store
        var object_id = dop.data.object_inc++,
        // Setting up the object to listen the sync event
        config = {
            object: object,
            options: dop.util.merge({persistent:true}, options),
            owner: owner,
            nodes: 0,
            node: {}
        };

        var proxy = dop.core.configureObject( object, [object_id], owner );
        config.proxy = proxy;
        dop.data.object[object_id] = config;
        return proxy;
    }
    else
        return dop.data.object[object[dop.specialkey.object_path][0]].proxy;

};
