

syncio.onmessage = function(user, message){

    var message_json = undefined;

    if (typeof message == 'string') {
        try { message_json = syncio.parse( message ); } 
        catch(e) {}
    }
    else 
        message_json = message;

    this.emit( syncio.on.message, user, message_json, message );
    
};