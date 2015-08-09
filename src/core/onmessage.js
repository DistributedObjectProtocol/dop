

syncio.onmessage = function( user, message_raw ) {

    var user = this.users[ user[syncio.key_user_token] ],
        messages = undefined;

    if (typeof message_raw == 'string') {
        try { messages = syncio.parse( message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( syncio.on.message, user, messages, message_raw );


    // Managing protocol
    if ( typeof messages == 'object' ) {


        if (typeof messages[0] != 'object')
            messages = [messages];


        // Managing all messages one by one
        for (var i=0, t=messages.length, request, messages_id, action; i<t; i++) {

            request = messages[i];
            request_id = request[0];
            action = request[1];

            // If is a number we manage the OSP request
            if ( typeof request_id == 'number' ){

                // Is a request?
                if ( request_id > 0 ) {

                    var response = [request_id * -1];

                    // SYNC
                    if ( syncio.protocol.sync === action ) {

                        var object_name = request[2];

                        // If Object not found
                        if (typeof this.objects_original[object_name] != 'object') {
                            response.push( syncio.error.client.OBJECT_NOT_FOUND );
                            syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
                        }

                        // If the user already is subscribed to this object
                        else if ( typeof user.objects[object_name] == 'object' ) {
                            response.push( syncio.error.client.ALREADY_SYNCED );
                            syncio.onmessage.response.call(this, syncio.on.error, user, request, response );
                        }

                        else {

                            response.push( action );

                            var sync_object = function( object ) {

                                // If the object doesn't exist yet
                                if ( typeof object[syncio.key_object_id] == 'undefined' ) {
                                    this.objects[ this.object_id ] = {object:object, name:object_name, users:{}}; // users is an objects of the users than are subscribed to this object
                                    var object_id = this.object_id++;
                                    Object.defineProperty(object, syncio.key_object_id, {value: object_id});

                                    // // If the object is observable
                                    // if ( this.objects_original[object_name].observable )
                                    //     syncio.observe.call( this, object );
                                }
                                // If the object exists we get the object_id
                                else {
                                    var object_id = object[syncio.key_object_id];
                                    if ( object !== this.objects[ object_id ] ) {
                                        new TypeError('No se puede syncronizar objetos que estan dentro de otros objetos');
                                        // object = this.objects[ object_id ];
                                    }
                                }

                                // Setting the object to the user
                                user.objects[object_name] = object;

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

                                // Sending response
                                syncio.onmessage.response.call(this, syncio.on.sync, user, request, response );

                            };

                            // Getting the object
                            ( typeof this.objects_original[object_name].object == 'function' ) ?
                                this.objects_original[object_name].object( user, messages, sync_object.bind(this) )
                            :
                                sync_object.call(this, this.objects_original[object_name].object );

                        }

                    }

                }

                // Then is a response.
                else {

                    request_id = request_id*-1;

                    if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                    // Connect
                    if ( syncio.protocol.connect === action )
                        this.emit( syncio.on.connect, user );

                    }

                    // Removing request
                    delete this.requests[request_id];

                }

            }

        }

    }

};


syncio.onmessage.response = function( eventype, user, request, response ) {

    // Forming params for the event onsync
    var emit_params = [eventype, user, request, response];

    // We emit the event
    this.emit.apply( this, emit_params );

    // Sending the response
    this.response( user, response );

};

