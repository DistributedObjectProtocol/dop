
dop.protocol._onsubscribe = function( node, request_id, request, response ) {

    if (response[0] !== 0)
        request.promise.reject( dop.core.getRejectError(response[0], request[2]) );

    else {
        var object_name = request[2],
            object_remote_id = response[1],
            object_remote = response[2],
            object = dop.register(object_remote),
            object_id = dop.getObjectId(object);
        node.object[object_name] = object;
        // dop.data.object[object_id].node_owner = node.token;
        // node.register(object_id, object_name); // We dont register objects for owners
        node.object_ref[object_remote_id] = object_id;
        request.promise.resolve( object );
    }

};