
dop.protocol.patch = function(node, object_id, patch) {
    var object_node = dop.data.object[object_id].node[node.token],
        version = ++object_node.version;
    object_node.pending.push([version, dop.util.merge({}, patch)]); // Making a copy because this object is exposed to the api users and can be mutated
    return dop.protocol.patchSend(node, object_id, object_node, version, patch);
};

// Also used by dop.protocol._onpatch
dop.protocol.patchSend = function(node, object_id, object_node, version, patch) {
    var request = dop.core.createRequest( node, dop.protocol.instructions.patch, object_id, version, patch);
    dop.core.storeSendMessages(node, request, dop.encodeFunction);
    return request.promise;
};