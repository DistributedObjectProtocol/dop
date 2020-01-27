dop.protocol.patch = function(node, object_path_id, chunks, subscriber) {
    var version = ++subscriber.version
    subscriber.pending.push([version, chunks])
    return dop.protocol.patchSend(node, object_path_id, version, chunks)
}

// Also used by dop.protocol._onpatch
dop.protocol.patchSend = function(node, object_path_id, version, chunks) {
    var request = dop.core.createRequest(
        node,
        dop.protocol.instructions.patch,
        object_path_id,
        version,
        chunks
    )
    dop.core.storeAndSendRequests(node, request, dop.encodeFunction)
    return request.promise
}
