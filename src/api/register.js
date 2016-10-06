
dop.register = function(object, options) {

    dop.util.invariant(dop.util.isObject(object), 'dop.register needs a regular object as first parameter');

    if (dop.isRegistered(object))
        return object;    

    var object_id = dop.data.object_inc++;
    options = dop.util.merge({proxy:true}, options);
    object = dop.core.configureObject( object, [object_id], options.proxy );
    dop.data.object[object_id] = object;
    dop.data.object_data[object_id] = {
        node: {},
        nodes: 0,
        options: options
    };

    return object;

};
