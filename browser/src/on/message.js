

synko.on.message = function( message_raw ) {

    var messages;

    // Parsing message
    if (typeof message_raw == 'string') {
        try { messages = synko.parse.call(this, message_raw ); } 
        catch(e) {}
    }
    else 
        messages = message_raw;


    this.emit( 'message', messages, message_raw );


    // Managing OSP protocol
    if ( synko.util.typeof( messages ) == 'array' )
        synko.osp.call( this, this, messages );


};