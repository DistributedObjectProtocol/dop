
dop.protocol._onsubscribe = function(node, request_id, request, response) {

    if (response[0] !== undefined) {

        if (response[0] !== 0)
            request.promise.reject(dop.core.getRejectError(response[0], request[2]));

        else {
            var object_path = response[1],
                object_owner_id = object_path[0],
                object_owner = response[2],
                object;

            if (node.object_owner[object_owner_id] === undefined) {
                var collector = dop.collectFirst();
                object = dop.register((dop.isObjectRegistrable(request.into)) ? 
                    dop.core.setAction(request.into, object_owner)
                :
                    object_owner);
                dop.core.registerOwner(node, object, object_owner_id);
                collector.emitAndDestroy();
            }
            else
                object = dop.data.object[node.object_owner[object_owner_id]].object;


            request.promise.resolve(dop.util.get(object, object_path.slice(1)));
        }
    }

};