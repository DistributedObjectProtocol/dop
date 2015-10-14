

syncio.on.connect = function connect( user ) {

	var request = syncio.request.call(this, [syncio.protocol.connect, user.token, this.remote_function] );

    this.emit( 'connect', user, request );

    user.send( JSON.stringify( request.data ) );

};