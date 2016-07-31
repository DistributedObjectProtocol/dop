
dop.core.registerObject = function( node, object, node_owner, options ) {

    // Getting id or creating new id
    var object_id = ( object.hasOwnProperty(dop.specialkey.object_path) ) ?
        object[dop.specialkey.object_path][0]
    :
        dop.data.object_inc++;

    if ( dop.data.object[object_id] === undefined ) {

        // Making config and storing it on dop.data.object[]
        var config = {
            object: object,
            options: dop.util.merge({}, options),
            nodes: 0,
            node: {},
            node_owner: node_owner
        },

        proxy = dop.core.configureObject( object, [object_id], node_owner===false );
        config.proxy = proxy;
        dop.data.object[object_id] = config;
        return proxy;
    }

    else
        return dop.data.object[object_id].proxy;

};
