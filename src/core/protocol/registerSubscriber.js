dop.core.registerSubscriber = function(node, object) {
    var object_data = dop.core.registerObjectToNode(node, object),
        object_id = dop.getObjectId(object_data.object)
    node.subscriber[object_id] = true
    if (object_data.node[node.token].subscriber) return false
    else {
        object_data.node[node.token].subscriber = 1
        return true
    }
}
