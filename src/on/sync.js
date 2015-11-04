

syncio.on.sync = function sync( user, request ) {

    var response = [ request[0] * -1 ];
    var object_name = request[2];

    // // If Object not found
    // if (typeof this.objects_original[object_name] != 'object') {
    //     response.push( syncio.error.client.OBJECT_NOT_FOUND );
    //     syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
    // }

    // // If the user already is subscribed to this object
    // else if ( typeof user.objects[object_name] == 'object' ) {
    //     response.push( syncio.error.client.ALREADY_SYNCED );
    //     syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
    // }

    // else {

        response.push( request[1] );

        var sync_object = function( object ) {

            // object must be an array or object
            if ( object == null || typeof object != 'object' )
                throw new TypeError( syncio.error.SYNC_MUST_BE_OBJECT );



            // If the object already exists
            if ( syncio.typeof( object[syncio.key_object_path] ) == 'array' ) {

                // we get the object_id
                var object_id = object[syncio.key_object_path][0];

                if ( typeof this.objects[object_id] == 'object' ) {

                    // Checking if the object is already synced with other name
                    if( this.objects[object_id].name !== object_name )
                        throw new TypeError( syncio.error.SYNC_NO_REPEAT );

                    this.objects[object_id].subscribed += 1;

                }

                // // Checking if the object is inside into another object already synced
                // else if ( object[syncio.key_object_path].length > 1 && object === syncio.getset(
                //         this.objects[object[syncio.key_object_path][0]].object,
                //         object[syncio.key_object_path].slice(1)
                //     ) 
                // )
                //     throw new TypeError( syncio.error.SYNC_NO_INNER );

            }


            // If the object doesn't exist yet
            else {

                var object_id = this.object_id++,
                    path = [object_id];


                syncio.configure.call(
                    this,
                    object, 
                    path, 
                    this.objects_original[object_name].observable
                );

            }



            // Storing object
            if ( typeof this.objects[object_id] != 'object' || this.objects[object_id].object !== object )
                this.objects[ object_id ] = {object:object, name:object_name, users:{}, subscribed:1}; // users is an objects of the users than are subscribed to this object

            // Setting the object to the user
            user.objects[object_name] = object;

            // Set to the user if the object is writable for him or not
            user.writables[object_name] = this.objects_original[object_name].writable;

            // Adding the user as subscriber of this object
            this.objects[ object_id ].users[ user.token ] = true; 
            
            // Forming the response
            response.push(
                object_id,
                user.writables[object_name]*1, // false*1 === 0
                object
            );

            // Sending response
            user.send( syncio.stringify(response) );

        };

        // Getting the object
        ( typeof this.objects_original[object_name].object == 'function' ) ?
            this.objects_original[object_name].object( user, request, sync_object.bind(this) )
        :
            sync_object.call( this, this.objects_original[object_name].object );

    // }

};