

dop.on.message = function( message_raw ) {

    var messages;

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = dop.parse.call(this, message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', messages, message_raw );


    // Managing protocol
    if ( dop.util.typeof( messages ) == 'array' )
        dop.manage.call( this, this, messages );


};