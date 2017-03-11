
dop.register = function(object) {

    dop.util.invariant(dop.util.typeof(object) == 'object', 'dop.register needs a regular plain object as first parameter');

    if (dop.isRegistered(object))
        return dop.getObjectProxy(object);    

    var object_id = dop.data.object_inc++;
    // options = dop.util.merge({unregister:false}, options);
    object = dop.core.configureObject(object, [object_id]);
    // dop.data.object[object_id] = object;
    // dop.data.object_data[object_id] = {
    //     last: 0, // last mutation id
    //     nodes: 0, // total nodes depending
    //     options: options,
    //     owners: {},
    //     subscribers: {}
    // };

    return object;

};
