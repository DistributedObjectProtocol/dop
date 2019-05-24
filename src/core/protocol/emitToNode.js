dop.core.emitToNode = function(node, object_path_id, patch) {
    var object_id, chunks
    for (object_id in patch) {
        chunks = patch[object_id].chunks
        dop.protocol.patch(
            node,
            object_id,
            chunks.length > 1 ? chunks : chunks[0]
        )
    }
}
