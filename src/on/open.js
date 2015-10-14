

syncio.on.open = function open( user_socket ){

    // Setup new user
    var user = new syncio.user( this, user_socket, this.user_id++ );
    user_socket[ syncio.key_user_token ] = user.token;

    // Setup server for new user
    this.users[ user.token ] = user;

    // Event
    this.emit( 'open', user );

    syncio.on.connect.call( this, user );

};