

syncio.onopen = function( user_socket ){

    // Setup new user
    var user = new syncio.user( user_socket, this.user_id++ );
    user_socket[ syncio.key_user_token ] = user.token;

    // Setup server for new user
    this.users[ user.token ] = user;
    this.emit( syncio.on.open, user );

    // Sending token to the user
    user_socket.send( JSON.stringify( this.request(syncio.protocol.connect, user.token).data ) );
    // For broadcast
    // request = this.request(syncio.protocol.connect, user[syncio.key_user_token]).data );
    // this.requests[ request[0] ].total += 1;

};