
dop.core.unregisterNode = function( node ) {
    var object_id, object_data;
    for ( object_id in node.object_id ) {

        object_data = dop.data.object[object_id];

        // Deleting instance inside of dop.data.object
        object_data.nodes -= 1;
        delete object_data.node[node.token];

        // Deleting data if no more nodes are using it
        if ( object_data.nodes === 0 ) {
            delete object_data.nodes;
            delete object_data.node;
        }
    }

    delete dop.data.node[ node.token ];
};