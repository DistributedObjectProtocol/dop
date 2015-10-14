

syncio.on.open = function open( user_socket ){

    this.emit( 'open', user_socket );

};