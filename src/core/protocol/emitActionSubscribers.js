
dop.core.emitActionSubscribers = function( action ) {
    var object_id, node_token;
    for (object_id in action)
        if ( dop.data.object[object_id].nodes > 0 )
            for (node_token in dop.data.object[object_id].node)
                dop.protocol.merge(dop.data.node[node_token], object_id, action[object_id]);
};