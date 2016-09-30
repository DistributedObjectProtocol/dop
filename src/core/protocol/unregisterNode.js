
dop.core.unregisterNode = function( node ) {
    var object_id, object_data;
    for ( object_id in node.object_subscribed ) {

        object_data = dop.data.object[object_id];

        // Deleting instance inside of dop.data.object
        object_data.nodes -= 1;
        delete object_data.node[node.token];
    }

    delete dop.data.node[ node.token ];
};