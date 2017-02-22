
dop.protocol.onpatch = function(node, request_id, request) {
    var object_id_owner = request[1],
        object_id = node.owner[object_id_owner],
        version = request[2],
        patch = request[3],
        response = dop.core.createResponse(request_id),
        object_data = dop.data.object[object_id],
        object_node,
        collector;
    
    if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].owner===object_id_owner) {
        object_node = object_data.node[node.token];
        // Storing patch
        if (object_node.applied_version < version && object_node.applied[version]===undefined) {
            // Storing patch
            object_node.applied[version] = patch;
            // Applying
            collector = dop.collectFirst();
            while (object_node.applied[object_node.applied_version+1]) {
                object_node.applied_version += 1;
                dop.core.setPatchFunction(object_data.object, object_node.applied[object_node.applied_version]);
                delete object_node.applied[object_node.applied_version];
            }
            collector.emit();
        }
        response.push(0);
    }
    else
        response.push(dop.core.error.reject_remote.OBJECT_NOT_FOUND);
    
    dop.core.storeSendMessages(node, response);
};