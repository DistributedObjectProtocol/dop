
dop.core.emitNodes = function(action) {
    var object_id, node_token, node, object_data;
    for (object_id in action) {
        if (isObject(dop.data.object[object_id])) {
            object_data = dop.data.object[object_id];
            for (node_token in object_data.node) {
                if (object_data.node[node_token].subscriber===1) {
                    node = dop.data.node[node_token];
                    dop.protocol.mutation(node, object_id, action[object_id].action);
                }
            }
        }
    }
};