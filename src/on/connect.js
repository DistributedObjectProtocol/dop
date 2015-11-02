

syncio.on.connect = function connect( user_socket, request ) {

    var response = [request[0] * -1],
        user = new syncio.user( this, user_socket, this.user_id++ );

    user_socket[ syncio.key_user_token ] = user.token;

    // Setup server for new user
    this.users[ user.token ] = user;

    response.push( syncio.protocol.connect, user.token );

    if ( this.key_remote_function !== syncio.key_remote_function )
        response.push( this.key_remote_function );
    

    this.emit( 'connect', user, request, response );

    user.send( JSON.stringify( response ) );

};