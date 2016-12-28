
dop.protocol._onunsubscribe = function(node, request_id, request, response) {

    if (response[0] !== undefined) {
        if (response[0] !== 0)
            request.promise.reject(response[0]);
        else {
            var object_owner_id = request[2],
                object_id = node.owner[object_owner_id],
                object_data = dop.data.object[object_id];

            if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].owner===object_owner_id) {
                var roles = object_data.node[node.token];
                roles.owner = 0;

                if (roles.subscriber === 0)
                    object_data.nodes_total -= 1;

                if (object_data.nodes_total === 0)
                    delete dop.data.object[object_id];
                
                request.promise.resolve();
            }
        }
    }
};