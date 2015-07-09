

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

                        var object, object_id;

                        response.push( action );

                        if (!this.object_original[object_name].options.unique || this.object_original[object_name].ids.length==0) {
                            object = syncio.merge({}, this.object_original[object_name].object);
                            object_id = this.objects.push( {object:object, users: [user.token]} )-1; // The second parameter is an array of the users than are subscribed to this object
                            this.object_original[object_name].ids.push( object_id );
                        }
                        else {
                            object_id = this.object_original[object_name].ids[0];
                            object = this.objects[object_id].object;
                            this.objects[object_id].users.push( user.token );
                        }
                        response.push(object_id);
                        response.push(object);
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