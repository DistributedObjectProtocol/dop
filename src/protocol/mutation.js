
dop.protocol.mutation = function(node, object_id, action) {
    var version = ++dop.data.object[object_id].node[node.token].subscriber_version,
        request = dop.core.createRequest(node, dop.protocol.instructions.mutation, object_id, version, action);

    dop.core.storeSendMessages(node, request);
    return request.promise;
};

dop.protocol.onmutation = function(node, request_id, request) {
    console.log( dop.env,request_id,request );
}