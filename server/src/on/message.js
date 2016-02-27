

synko.on.message = function( user_socket, message_raw ) {

    var messages, 
        user = (typeof user_socket[synko.key_user_token] == 'undefined' ) ?
            user_socket
        :
            this.users[ user_socket[synko.key_user_token] ];

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = synko.parse.call(this, message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', user, messages, message_raw );


    // Managing OSP protocol
    if ( synko.util.typeof( messages ) == 'array' )
        synko.osp.call( this, user, messages );

};