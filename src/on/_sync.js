

syncio._on.sync = function( user, response ) {

    var object_id = user.requests[ response[0]*-1 ].data[2],
        object_name = user.requests[ response[0]*-1 ].data[5],
        object_remote = response[2];


    // If the object is writable and the response has an object to merge
    if ( user.writables[object_name] && typeof object_remote == 'object' ) {

        var object = syncio.objects[object_id].object;

        syncio.merge( object_remote, object );

        syncio.merge( object, object_remote );

        syncio.configure.call(this, object, object[syncio.key_object_path] );

    }

    console.log( object_name, user.writables[object_name], object );


};