
dop.core.unregisterNode = function(node) {
    var object_id, object_owner_id, object_data;
    // Removing subscribed objects
    for (object_id in node.object_subscribed) {
        object_data = dop.data.object[object_id];
        if (object_data.node[node.token] !== undefined) {
            object_data.nodes_total -= 1;
            delete object_data.node[node.token];
        }
    }
    // Removing owner objects
    for (object_owner_id in node.object_owner) {
        object_id = node.object_owner[object_owner_id];
        object_data = dop.data.object[object_id];
        if (object_data.node[node.token] !== undefined) {
            object_data.nodes_total -= 1;
            delete object_data.node[node.token];
        }
    }
    // Deleting object data if not more nodes are depending
    if (object_data.nodes_total === 0)
        delete dop.data.object[object_id];
    delete dop.data.node[node.token];
};