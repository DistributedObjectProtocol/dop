
dop.core.registerObjectToNode = function(node, object) {
    var object_id = dop.getObjectId(object),
        object_data = dop.data.object_data[object_id];

    if (object_data.node[node.token] === undefined) {
        object_data.node[node.token] = true;
        object_data.nodes += 1;
        node.object_subscribed[object_id] = true;
        return true;
    }
    else
        return false;
};