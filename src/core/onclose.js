
dop.core.onclose = function( listener_or_node, socket ) {

    var isListener = ( listener_or_node.socket !== socket ),
        node = (isListener) ? dop.getNodeBySocket( socket ) : listener_or_node;

    listener_or_node.emit( 'close', socket );

    if ( dop.isObject(node) ) {

        listener_or_node.emit( 'disconnect', node );

        for ( var object_id in node.object_id ) {

            // Deleting instance inside of dop.data.object
            dop.data.object[object_id].nodes -= 1;
            delete dop.data.object[object_id].node[node.token];

            // Deleting completly object if no more nodes are using it
            if ( dop.data.object[object_id].nodes === 0 )
                delete dop.data.object[object_id];
        }

        delete dop.data.node[ node.token ];

    }
};


/*
            // Deleting completly object if necesary
            if (dop.data.object[object_id].nodes === 0 && // No more nodes using this object
                (
                    dop.data.object[object_id].node_owner !== false || // Im not the owner OR
                    (
                        dop.data.object[object_id].owner && // Im the owner
                        !dop.data.object[object_id].options.persistent // And is not a persistent object
                    )
                )
            )
                delete dop.data.object[object_id];
*/                