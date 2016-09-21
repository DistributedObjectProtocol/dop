
dop.register = function( object, options ) {

    if (dop.isRegistered(object))
        return object;    

    var object_id = dop.data.object_inc++;
    options = dop.util.merge({proxy:true}, options);
    object = dop.core.configureObject( object, [object_id], options.proxy );
    dop.data.object[object_id] = {
        object: object,
        node: {},
        nodes: 0,
        mutations: [],
        collecting: false,
        options: options
    };

    return object;

};
