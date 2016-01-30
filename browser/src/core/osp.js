

synko.osp = function( user, messages ) {


    if (typeof messages[0] != 'object')
        messages = [messages];


    // Managing all messages one by one
    for (var i=0, t=messages.length, request, request_id, action; i<t; i++) {

        request = messages[i];
        request_id = request[0];
        action = request[1];

        // If is a number we manage the OSP request
        if ( typeof request_id == 'number' ) {

            // REQUEST ===============================================================
            if (request_id > 0 && typeof synko.on[synko.protocol_keys[action]] == 'function' )
                synko.on[synko.protocol_keys[action]].call( this, user, request );


            // RESPONSE ===============================================================
            else {

                request_id *= -1;

                if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                    action = this.requests[ request_id ].data[1];

                    if ( request[1] === 0 )
                        synko._on[synko.protocol_keys[action]].call( this, user, request );

                    else
                        synko.on.reject.call( this, user, request );

                    // Removing request
                    if ( --this.requests[request_id].users === 0 )
                        delete this.requests[request_id];

                }

            }

        }

    }

};