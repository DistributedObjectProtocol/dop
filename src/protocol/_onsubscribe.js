
dop.protocol._onsubscribe = function(node, request_id, request, response) {

    if (response[0] !== undefined) {

        if (response[0] !== 0)
            request.promise.reject(response[0]);

        else {
            var object_path = typeof response[1]=='number' ? [response[1]] : response[1],
                object_owner_id = object_path[0],
                object_owner = response[2],
                object;
            
            if (!isArray(object_path) || typeof object_owner_id!='number')
                request.promise.reject(dop.core.error.reject.OBJECT_NOT_FOUND);

            else {
                if (node.owner[object_owner_id] === undefined) {
                    var collector = dop.collectFirst();
                    object = dop.register((dop.isObjectRegistrable(request.into)) ? 
                        dop.core.setActionRemote(request.into, object_owner)
                    :
                        object_owner);
                    dop.core.registerOwner(node, object, object_owner_id);
                    collector.emitAndDestroy();
                }
                else
                    object = dop.data.object[node.owner[object_owner_id]].object;

                object = dop.util.get(object, object_path.slice(1));

                (!isObject(object)) ?
                    request.promise.reject(dop.core.error.reject.OBJECT_NOT_FOUND)
                :
                    request.promise.resolve(object);
            }
        }
    }

};