

syncio.onmessage = function( user, message ) {

    var user = this.users[ user[syncio.key_user_token] ],
        requests = undefined;

    if (typeof message == 'string') {
        try { requests = syncio.parse( message ); } 
        catch(e) {}
    }
    else 
        requests = message;


    this.emit( syncio.on.message, user, requests, message );


    // Managing protocol
    if ( typeof requests == 'object' ) {


        if (typeof requests[0] != 'object')
            requests = [requests];


        // Managing all requests one by one
        for (var i=0, t=requests.length, request, requests_id, action; i<t; i++) {

            request = requests[i];
            request_id = request[0];
            action = request[1];


            // Is a request?
            if (request_id > 0) {

                var response = [request_id * -1];

                // SYNC
                if ( syncio.protocol.sync === action ) {

                    var object_name = request[2];

                    // If Object not found
                    if (typeof this.objects_original[object_name] != 'object')
                        response.push( syncio.error.server.object_not_found );

                    else {

                        response.push( action );

                        var sync_object = function( object ) {

                            // If the object doesn't exist yet
                            if ( typeof object[syncio.key_object_id] == 'undefined' ) {
                                console.log( this );
                                this.objects[ this.object_id ] = {object:object, name:object_name, users:{}}; // users is an objects of the users than are subscribed to this object
                                var object_id = this.object_id++;
                                Object.defineProperty(object, syncio.key_object_id, {value: object_id});
                            }
                            // If the object exists we get the object_id
                            else
                                var object_id = object[syncio.key_object_id];

                            // Set to the user if the object is writable for him or not
                            user.writables[object_name] = this.objects_original[object_name].writable;

                            // Adding the user as subscriber of this object
                            this.objects[ object_id ].users[ user.token ] = 0; 
                            
                            // Forming the response
                            response.push(
                                object_id,
                                user.writables[object_name]*1, // false*1 === 0
                                object
                            );

                            syncio.onmessage.request.call(this, user, request, response);

                        };

                        // Getting the object
                        return ( typeof this.objects_original[object_name].object == 'function' ) ?
                            this.objects_original[object_name].object( user, requests, sync_object.bind(this) )
                        :
                            sync_object.call(this, this.objects_original[object_name].object );

                    }

                }

                

            }

            // Then is a response.
            else {

            }

        }

    }

};


syncio.onmessage.request = function( user, request, response ) {

    // Forming params for the event onsync
    var params = [syncio.on.sync, user, response].concat( request.slice(2) );

    // We emit the event
    this.emit.apply( this, params );

    // Sending the response
    this.response( user, response );

};

