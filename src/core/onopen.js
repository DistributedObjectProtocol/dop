

syncio.onopen = function( user ){

    // Setup new user
    var token = (Math.random() * Math.pow(10,18));
    user[syncio.user_token_key] = token; // http://jsperf.com/token-generator
    user[syncio.user_server_key] = this;

    // Setup server for new user
    this.users[ token ] = user;
    this.emit( syncio.on.open, user );

    // Sending token to the user
    user.send( JSON.stringify( this.request(syncio.protocol.connect, token) ) );
    // For broadcast
    // request = syncio.request.call(this, syncio.protocol.connect, token);
    // this.requests[ request[0] ].total += 1;

}