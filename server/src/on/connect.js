

synko.on.connect = function( user_socket, request ) {

    var response = [request[0] * -1],
        user = new synko.user( this, user_socket );

    user_socket[ synko.key_user_token ] = user.token;  
    // Object.defineProperty(user_socket, synko.key_user_token, {
    //     value: user.token,
    //     enumerable: true,
    //     configurable: true,
    //     writable: false
    // });
   
    // Setup server for new user
    this.users[ user.token ] = user;

    response.push( synko.protocol.fulfilled, user.token );

    if ( typeof this.options.stringify_params[synko.stringify_function] == 'string' || 
         typeof this.options.stringify_params[synko.stringify_undefined] == 'string' || 
         typeof this.options.stringify_params[synko.stringify_regexp] == 'string'  )
        response.push( this.options.stringify_params );
    
    this.emit( 'connect', user, request, response );

    user.send( JSON.stringify( response ) );

};