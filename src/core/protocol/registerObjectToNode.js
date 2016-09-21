
dop.core.registerObjectToNode = function( node, object ) {
    var object_id = dop.getObjectId(object),
        object_data = dop.data.object[object_id];

    if ( object_data.node[node.token] === undefined ) {
        object_data.node[node.token] = true;
        object_data.nodes.length += 1;
        node.object_id[object_id] = true;
        return true;
    }
    else
        return false;
};