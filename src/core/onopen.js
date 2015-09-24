

syncio.onopen = function( user_socket ){

    // Setup new user
    var user = new syncio.user( this, user_socket, this.user_id++ );
    user_socket[ syncio.key_user_token ] = user.token;

    // Setup server for new user
    this.users[ user.token ] = user;

    this.emit( syncio.on.open, user );

    // Sending token to the user
    user_socket.send( JSON.stringify( syncio.request.call(this, [syncio.protocol.connect, user.token] ).data ) );

};