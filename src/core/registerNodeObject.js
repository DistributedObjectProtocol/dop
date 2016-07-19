

dop.core.registerNodeObject = function( node, object_id, object_name ) {
    var object_data = dop.data.object[object_id];
    node.object[object_name] = object_data.proxy;
    object_data.nodes += 1;
    object_data.node[node.token] = {name:object_name};
};