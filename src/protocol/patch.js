
dop.protocol.patch = function(node, object_id, patch) {
    var object_node = dop.data.object[object_id].node[node.token],
        version = ++object_node.version,
        request = dop.core.createRequest(
            node,
            dop.protocol.instructions.patch,
            object_id,
            version,
            patch
        );

    object_node.received[version] = {received:false, patch:dop.util.merge({}, patch)}; // Making a copy because this object is exposed to the api users and can be mutated
    dop.core.storeSendMessages(node, request, dop.encodeFunction);
    return request.promise;
};

dop.protocol.onpatch = function(node, request_id, request) {
    var object_id_owner = request[1],
        object_id = node.owner[object_id_owner],
        version = request[2],
        patch = request[3],
        response = dop.core.createResponse(request_id),
        object_data = dop.data.object[object_id],
        object_node,
        collector;
    console.log( version );
    if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].owner===object_id_owner) {
        object_node = object_data.node[node.token];
        // Storing patch
        if (object_node.applied_version < version && object_node.applied[version]===undefined) {
            console.log(version, 'entra')
            // Storing patch
            object_node.applied[version] = patch;
            // Applying
            collector = dop.collectFirst();
            while (object_node.applied[object_node.applied_version+1]) {
                object_node.applied_version += 1;
                console.log(object_node.applied_version, object_node.applied[object_node.applied_version]  );
                dop.core.setActionFunction(object_data.object, object_node.applied[object_node.applied_version]);
                delete object_node.applied[object_node.applied_version];
            }
            collector.emitAndDestroy();
        }
        console.log( '--' );
        // Confirm received
        response.push(0);
    }
    else
        response.push(dop.core.error.reject_remote.OBJECT_NOT_FOUND);
    
    dop.core.storeSendMessages(node, response);
};

dop.protocol._onpatch = function(node, request_id, request, response) {
    var rejection = response[0],
        object_id = request[2],
        object_node = dop.data.object[object_id].node[node.token],
        version = request[3],
        promise = request.promise;


    if (rejection !== undefined) {
        if (rejection === 0) {
            // Correct version applyed
            if (object_node.pending_version+1 === version) {
            console.log( object_node.pending_version, version );
                object_node.pending_version += 1;
                delete object_node.pending[object_node.pending_version];
                promise.resolve(response[1]);
            }
        }
        else
            promise.reject(dop.core.getRejectError(rejection));
    }
};