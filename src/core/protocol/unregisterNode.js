dop.core.unregisterNode = function(node) {
    var object_id, object_owner_id, object_data

    for (object_id in node.subscriber) {
        object_data = dop.data.object[object_id]
        if (object_data !== undefined) {
            // Removing subscriber objects
            if (object_data.node[node.token] !== undefined) {
                object_data.nodes_total -= 1
                delete object_data.node[node.token]
            }

            // Simply remove all associated objects for which this node has subscription
            // only if object node_total ==0; Added by Satyam Singh.
            if (object_data.nodes_total === 0) {
                delete dop.data.object[object_id]
            }
        }
    }

    // Removing owner objects
    for (object_owner_id in node.owner) {
        object_id = node.owner[object_owner_id]
        object_data = dop.data.object[object_id]
        if (
            object_data !== undefined &&
            object_data.node[node.token] !== undefined
        ) {
            object_data.nodes_total -= 1
            delete object_data.node[node.token]
        }
    }

    // Deleting node
    delete dop.data.node[node.token]
}
