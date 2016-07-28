
dop.core.onmessage = function( listener_or_node, socket, message_string, message_adapter ) {

    listener_or_node.emit( 'message', socket, message_string, message_adapter );

    var messages, 
        isListener = ( listener_or_node.socket !== socket ),
        node = ( isListener ) ? dop.data.node[ socket[dop.specialkey.socket_token] ] || {} : listener_or_node;


    // Parsing messages
    if ( typeof message_string == 'string' && message_string.substr(0,1) == '[' ) {
        try { messages = dop.decode( message_string ); } 
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
        for ( var i=0, t=messages.length, message, requests, request, request_id, response, action_type, message_typeof; i<t; i++ ) {

            message = messages[i];
            request_id = message[0];

            // If is a number we manage the request
            if ( typeof request_id == 'number' && request_id !== 0 ) {

                // If is only one request
                message_typeof = dop.util.typeof(message[1]);
                requests = (( message_typeof=='number' && message_typeof!='array') || (message_typeof=='string' && request_id<0) ) ? 
                    [request_id, message.slice(1)]
                :
                    requests = message;


                for ( var j=1, t2=requests.length, action_function; j<t2; ++j ) {
                    
                    request = requests[j];

                    if ( dop.util.typeof(request)=='array' && ((typeof request[0]=='number' && request_id>0) || request_id<0) ) {
                        
                        action_type = request[0];
                        action_function = 'on'+dop.protocol.actions[action_type];

                        // REQUEST ===============================================================
                        if (request_id>0 && typeof dop.protocol[action_function]=='function' )
                            dop.protocol[action_function]( node, request_id, request );


                        // RESPONSE ===============================================================
                        else {

                            request_id *= -1;

                            if ( node.requests[request_id] && typeof node.requests[request_id]=='object' ) {

                                response = request;
                                request = node.requests[request_id];

                                action_type = request[1];
                                action_function = '_on'+dop.protocol.actions[action_type];

                                if ( typeof dop.protocol[action_function]=='function' )
                                    dop.protocol[action_function]( node, request_id, request, response );
                                
                                delete node.requests[request_id];

                            }

                        }

                    }
                }

            }

        }

    }






    // var messages, 
    //     user = (typeof socket[dop.specialkey.socket_token] == 'undefined' ) ?
    //         socket
    //     :
    //         node.users[ socket[dop.specialkey.socket_token] ];






    // // Managing OSP protocol
    // if ( dop.util.typeof( messages ) == 'array' )
    //     dop.core.manage.call( this, user, messages );

};