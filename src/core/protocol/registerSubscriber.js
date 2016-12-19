
dop.core.registerSubscriber = function(node, object) {
    var object_data = dop.core.registerObjectToNode(node, object),
        object_id = dop.getObjectId(object_data.object);
    node.object_subscribed[object_id] = true;
    if (object_data.node[node.token].subscribed)
        return false;
    else {
        object_data.node[node.token].subscribed = true;
        return true;
    }
};