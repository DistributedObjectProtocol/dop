

syncio.onopen = function( user ){

    // Setup new user
    user[ syncio.key_user_token] = (Math.random() * Math.pow(10,18)); // http://jsperfcom/token-generator

    // Setup server for new user
    this.users[ user[syncio.key_user_token] ] = user;
    this.emit( syncio.on.open, user );

    // Sending token to the user
    user.send( JSON.stringify( this.request(syncio.protocol.connect, user[syncio.key_user_token]).data ) );
    // For broadcast
    // request = this.request(syncio.protocol.connect, user[syncio.key_user_token]).data );
    // this.requests[ request[0] ].total += 1;

}