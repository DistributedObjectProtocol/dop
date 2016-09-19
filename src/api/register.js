
dop.register = function( object, options ) {

    if (dop.isRegistered(object))
        return object;    

    var object_id = dop.data.object_inc++, object_data;
    options = dop.util.merge({makeProxy:true}, options);
    object = dop.core.configureObject( object, [object_id], options.makeProxy );
    object_data = dop.getObjectDop(object);
    object_data.options = options;
    dop.data.object[object_id] = {
        object: object,
        node: {},
        nodes: 0,
        collecting: false,
    };

    return object;

};
