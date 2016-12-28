
dop.core.registerOwner = function(node, object, object_owner_id) {
    var object_data = dop.core.registerObjectToNode(node, object),
        object_id = dop.getObjectId(object_data.object);
    object_data.node[node.token].owner = object_owner_id;
    node.owner[object_owner_id] = object_id;
};