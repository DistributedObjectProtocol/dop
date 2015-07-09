

syncio.onopen = function( user ){

    // Setup new user
    user.token = (Math.random() * Math.pow(10,18)); // http://jsperf.com/token-generator

    // Setup server for new user
    this.users[ user.token ] = user;
    this.emit( syncio.on.open, user );

    // Sending token to the user
    user.send( JSON.stringify( this.request(syncio.protocol.connect, user.token).data ) );
    // For broadcast
    // request = this.request(syncio.protocol.connect, user.token).data );
    // this.requests[ request[0] ].total += 1;

}