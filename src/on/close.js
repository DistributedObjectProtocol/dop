

syncio.on.close = function close( user_socket ){

    var user = this.users[ user_socket[syncio.key_user_token] ];

    this.emit( 'close', user );

    for ( var object_name in user.objects ) {

        // Remove object
        if (
            this.objects[ user.objects[object_name][syncio.key_object_path][0] ].subscribed == 1 && // The object only have had one subscribed
            this.objects_original[object_name].object !== user.objects[object_name] // Original object is different to the object
        )
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ];


        // Remove user listener from the object
        else
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ].users[ user.token ];

    }

    // Remove user
    delete this.users[ user.token ];

};