

syncio.on._connect = function _connect( user, request ) {

	// reconnect task are here
    this.emit( '_connect', user, request );

};