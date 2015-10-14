

syncio.on.close = function close( user_socket ){

    var user = this.users[ user_socket[syncio.key_user_token] ];

    this.emit( 'close', user );

    for ( var object_name in user.objects ) {

        // Remove object
        if (
            this.objects_original[object_name].object !== user.objects[object_name] && // Original object is different to the object
            this.objects[ user.objects[object_name][syncio.key_object_path][0] ].subscribed == 1 // The object only have had one subscribed
            // && !syncio.onclose.multipleusers(this.objects[ user.objects[object_name][syncio.key_object_path][0]].users, user.token )
        )
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ];

        // Remove user listener from the object
        else
            delete this.objects[ user.objects[object_name][syncio.key_object_path][0] ].users[ user.token ];

    }


    delete this.users[ user.token ];

};

// // Return true if the object has more users than the user_token passed
// syncio.onclose.multipleusers = function( users, user_token ) {

//     for (var token in users)

//         if ( user_token != token )

//             return true;

//     return false;

// };