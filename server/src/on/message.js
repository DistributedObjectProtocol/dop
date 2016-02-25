

dop.on.message = function( user_socket, message_raw ) {

    var messages, 
        user = (typeof user_socket[dop.key_user_token] == 'undefined' ) ?
            user_socket
        :
            this.users[ user_socket[dop.key_user_token] ];

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = dop.parse.call(this, message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', user, messages, message_raw );


    // Managing OSP protocol
    if ( dop.util.typeof( messages ) == 'array' )
        dop.manage.call( this, user, messages );

};