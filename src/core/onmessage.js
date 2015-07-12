

syncio.onmessage = function( user, message ) {

    var requests = undefined;

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
        for (var i=0, t=requests.length, requests_id, action, request, params; i<t; i++) {

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
                    if (typeof this.object_original[object_name] != 'object')
                        response.push( syncio.error.server.notfound );

                    else {

                        response.push( action );


                        // We create a copy of the object if is unique
                        var
                        object_id,
                        object = ( this.object_original[object_name].options.unique ) ?
                            syncio.merge({}, this.object_original[object_name].object)
                        :
                            this.object_original[object_name].object;


                        // If the object is unique or doesn't exist yet
                        if ( this.object_original[object_name].options.unique || typeof object[syncio.key_object_id] == 'undefined' ) {
                            this.objects[ this.object_id ] = {object:object, name:object_name, users:[ user[syncio.key_user_token] ]}; // The second parameter is an array of the users than are subscribed to this object
                            object_id = this.object_id++;
                            Object.defineProperty(object, syncio.key_object_id, {value: object_id});
                        }
                        // Getting the object_id
                        else {
                            object_id = object[syncio.key_object_id];
                            this.objects[ object_id ].users.push( user[syncio.key_user_token] );
                        }

                        response.push(object_id, object);
                    }

                    params = [syncio.on.sync, user, response].concat( request.slice(2) );
                    
                    this.emit.apply( this, params );

                }

                

            }

            // Then is a response.
            else {

            }

        }

    }


};