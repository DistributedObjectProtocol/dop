
dop.core.registerObjectToNode = function(node, object) {

    var object_id = dop.getObjectId(object), object_data;

    if (dop.data.object[object_id] === undefined)
        dop.data.object[object_id] = {
            object: object,
            nodes_total: 0,
            node: {}
        };
    
    object_data = dop.data.object[object_id];

    if (object_data.node[node.token] === undefined) {
        object_data.nodes_total += 1;
        object_data.node[node.token] = {
            subscribed: false, 
            owner: false
        };
    }

    return object_data;
};