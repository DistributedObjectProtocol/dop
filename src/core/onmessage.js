

dop.core.onmessage = function( listener_or_node, socket, message_string, message_adapter ) {

    listener_or_node.emit( 'message', socket, message_string, message_adapter );


    var messages, 
        isListener = ( listener_or_node.socket !== socket ),
        node = ( isListener ) ? dop.node[ socket[dop.key_user_token] ] || {} : listener_or_node;


    // Parsing messages
    if ( typeof message_string == 'string' && message_string.substr(0,1) == '[' ) {
        try { messages = dop.core.decode( node, message_string ); } 
        catch(e) { /*console.log(e);*/ }
    }
    else 
        messages = message_string;

    

    // Managing dop
    if ( dop.util.typeof(messages) == 'array' ) {

        // Detecting if is multimessage
        if ( typeof messages[0] == 'number' )
            messages = [messages];

        // Managing all messages one by one
        for (var i=0, t=messages.length, message, requests, request, request_id, action; i<t; i++) {

            message = messages[i];
            request_id = message[0];

            // If is a number we manage the request
            if ( typeof request_id == 'number' && request_id !== 0 ) {

                // If is only one request
                requests = ( typeof message[1] == 'number' ) ? 
                    [request_id, message.slice(1)]
                :
                    requests = message;


                for (var j=1, t2=requests.length; j<t2; ++j) {
                    request = requests[j];
                    action = request[0];
                    if ( typeof action == 'number' )
                        console.log(request_id, request);
                }


                // REQUEST ===============================================================
                // if (request_id > 0 && typeof dop.protocol['on'+dop.protocol.keys[action]] == 'function' )
                    // dop.protocol['on'+dop.protocol.keys[action]]( node, request );


                // // RESPONSE ===============================================================
                // else {

                //     request_id *= -1;

                //     if ( this.requests[ request_id ] !== null && typeof this.requests[ request_id ] == 'object' ) {

                //         action = this.requests[ request_id ].data[1];

                //         if ( request[1] === 0 )
                //             synko._on[synko.protocol_keys[action]].call( this, user, request );

                //         else
                //             synko.on.reject.call( this, user, request );

                //         // Removing request
                //         if ( --this.requests[request_id].users === 0 )
                //             delete this.requests[request_id];

                //     }

                // }

            }

        }

    }






    // var messages, 
    //     user = (typeof socket[dop.key_user_token] == 'undefined' ) ?
    //         socket
    //     :
    //         this.users[ socket[dop.key_user_token] ];






    // // Managing OSP protocol
    // if ( dop.util.typeof( messages ) == 'array' )
    //     dop.core.manage.call( this, user, messages );

};