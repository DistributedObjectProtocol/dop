

dop.core.onclose = function( listener_or_node, socket ) {

    var isListener = ( listener_or_node.socket !== socket );

    listener_or_node.emit( 'close', socket );

    // var token_id = socket[dop.key_socket_token];
    // var node = dop.node[ token_id ];

    // delete dop.node[ token_id ];


    // if ( typeof node[dop.key_socket_token] == 'string' ) {

    //     var object_name, object_id;

    //     for ( object_name in user.objects ) {

    //         object_id = user.objects[object_name][dop.key_object_path][0];

    //         // Remove object
    //         if ( dop.objects[ object_id ].subscribed == 1) // The object only have one user subscribed
    //             delete dop.objects[ object_id ];

    //         // Remove user listener from the object
    //         else {
    //             dop.objects[ object_id ].subscribed--;
    //             delete dop.objects[ object_id ].users[ user.token ];
    //         }

    //     }

    //     this.emit( 'disconnect', user );

    //     // Remove user
    //     delete this.users[ user.token ];

    // }


};