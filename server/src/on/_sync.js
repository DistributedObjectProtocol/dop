

synko._on.sync = function( user, response ) {

    var request_id = response[0]*-1,
        object_id = this.requests[ request_id ].data[2],
        object_name = this.requests[ request_id ].data[5],
        object_remote = response[2],
        object = synko.objects[ object_id] .object;



    // If the object is writable and the response has an object to merge
    if ( user.writables[object_id] && typeof object_remote == 'object' ) {

        synko.util.merge( object_remote, object );

        synko.util.merge( object, object_remote );

        synko.configure.call(this, object, object[synko.key_object_path] );

    }

    this.requests[ request_id ].promise.resolve( object, object_id );

};