
dop.protocol.patch = function(node, object_id, patch) {
    var object_node = dop.data.object[object_id].node[node.token],
        version = ++object_node.subscriber_version,
        request = dop.core.createRequest(
            node,
            dop.protocol.instructions.patch,
            object_id,
            version,
            patch
        );

    object_node.pending[version] = patch;
    dop.core.storeSendMessages(node, request, dop.encodeFunction);
    return request.promise;
};

dop.protocol.onpatch = function(node, request_id, request) {
    var object_id = request[1],
        version = request[2],
        patch = request[3],
        response = dop.core.createResponse(request_id),
        object_data = dop.data.object[object_id],
        object_node;
    
    if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].owner===object_id) {
        object_node = object_data.node[node.token];
        if (object_node.owner_version+1 === version) {
            // We apply patch
            object_node.owner_version += 1;
            collector = dop.collectFirst();
            dop.core.setActionFunction(object_data.object, patch);
            collector.emitAndDestroy();
            response.push(0);
        }
    }
    else
        response.push(dop.core.error.reject_remote.OBJECT_NOT_FOUND);
    
    dop.core.storeSendMessages(node, response);
};

dop.protocol._onpatch = function(node, request_id, request, response) {
    var rejection = response[0],
        promise = request.promise;
    if (rejection !== undefined) {
        if (rejection === 0) {
            
            promise.resolve(response[1]);
        }
        else
            promise.reject(dop.core.getRejectError(rejection));
    }
};