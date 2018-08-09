dop.core.emitNodes = function(patch) {
    var object_id, node_token, node, object_data, chunks
    for (object_id in patch) {
        if (isObject(dop.data.object[object_id])) {
            object_data = dop.data.object[object_id]
            for (node_token in object_data.node) {
                if (object_data.node[node_token].subscriber === 1) {
                    node = dop.data.node[node_token]
                    chunks = patch[object_id].chunks
                    dop.protocol.patch(
                        node,
                        Number(object_id),
                        chunks.length > 1 ? chunks : chunks[0]
                    )
                }
            }
        }
    }
}
