

syncio.on.close = function close( user_socket ){

    var object_name, object_id, user = this.users[ user_socket[syncio.key_user_token] ];

    this.emit( 'close', user );

    for ( object_name in user.objects ) {

        object_id = user.objects[object_name][syncio.key_object_path][0];

        // Remove object
        if ( syncio.objects[ object_id ].subscribed == 1) // The object only have one user subscribed
            delete syncio.objects[ object_id ];

        // Remove user listener from the object
        else {
            syncio.objects[ object_id ].subscribed--;
            delete syncio.objects[ object_id ].users[ user.token ];
        }

    }

    // Remove user
    delete this.users[ user.token ];

};