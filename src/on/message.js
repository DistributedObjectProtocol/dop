

syncio.on.message = function message( user_socket, message_raw ) {

    var messages, 
        user = (typeof user_socket[syncio.key_user_token] == 'undefined' ) ?
            user_socket
        :
            this.users[ user_socket[syncio.key_user_token] ];

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = syncio.parse( message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', user, messages, message_raw );


    // Managing OSP protocol
    if ( syncio.typeof( messages ) == 'array' )
        syncio.osp.call( this, user, messages );

};