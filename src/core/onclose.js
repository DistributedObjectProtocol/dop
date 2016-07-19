

dop.core.onclose = function( listener_or_node, socket ) {

    var isListener = ( listener_or_node.socket !== socket ),
        node = (isListener) ? dop.getNodeBySocket( socket ) : listener_or_node;

    listener_or_node.emit( 'close', socket );

    if ( typeof node == 'object' ) {

        listener_or_node.emit( 'disconnect', node );
        delete dop.data.node[ node.token ];

    //     var object_name, object_id;

    //     for ( object_name in user.objects ) {

    //         object_id = user.objects[object_name][dop.key_object_path][0];

    //         // Remove object
    //         if ( dop.data.objects[ object_id ].subscribed == 1) // The object only have one user subscribed
    //             delete dop.data.objects[ object_id ];

    //         // Remove user listener from the object
    //         else {
    //             dop.data.objects[ object_id ].subscribed--;
    //             delete dop.data.objects[ object_id ].users[ user.token ];
    //         }

    //     }

    //     this.emit( 'disconnect', user );

    //     // Remove user
    //     delete this.users[ user.token ];

    }
};