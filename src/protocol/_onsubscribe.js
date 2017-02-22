
dop.protocol._onsubscribe = function(node, request_id, request, response) {

    if (response[0] !== undefined) {

        if (response[0] !== 0)
            request.promise.reject(dop.core.getRejectError(response[0]));

        else {
            var object_path = typeof response[1]=='number' ? [response[1]] : response[1],
                object_owner_id = object_path[0],
                object_owner = response[2],
                object, collector;
            
            if (!isArray(object_path) || typeof object_owner_id!='number')
                request.promise.reject(dop.core.error.reject_local.OBJECT_NOT_FOUND);

            else {
                if (node.owner[object_owner_id] === undefined) {
                    collector = dop.collectFirst();
                    if (dop.isRegistered(request.into))
                        object = dop.core.setPatchFunction(request.into, object_owner);
                    else
                        object = dop.register((request.into===undefined) ? 
                            object_owner
                        :
                            dop.core.setPatch(request.into, object_owner)
                        );
                    dop.core.registerOwner(node, object, object_owner_id);
                    collector.emit();
                }
                else
                    object = dop.data.object[node.owner[object_owner_id]].object;

                object = dop.util.get(object, object_path.slice(1));

                if (!isObject(object))
                    request.promise.reject(dop.core.error.reject_local.OBJECT_NOT_FOUND);
                else
                    request.promise.resolve(dop.getObjectProxy(object));
            }
        }
    }
};