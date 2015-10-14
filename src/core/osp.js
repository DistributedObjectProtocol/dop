

syncio.osp = function( sender, messages ) {


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
            if (request_id > 0) {

                var response = [request_id * -1]; // Array of the response

                switch( action ) {

                    case syncio.protocol.request:
                        syncio.on.request.call( this, sender, request, response );
                        break;

                    case syncio.protocol.connect:
                        syncio.on.connect.call( this, sender, request, response );
                        break;
                        
                    // case syncio.protocol.sync:
                        // console.log('SYNC');
                        // break;
                }

            }

            // RESPONSE ===============================================================
            else {

                request_id *= -1;

                if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                    switch( action ) {

                        // case syncio.protocol.request:
                        //     syncio.on._request.call( this, sender, request );
                        //     break;

                        case syncio.protocol.connect:
                            syncio.on._connect.call( this, sender, request );
                            break;

                    }

                    // Removing request
                    delete this.requests[request_id];

                }

            }

        }

    }

};