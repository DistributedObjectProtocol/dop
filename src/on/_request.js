

syncio.on._request = function _request( user, request ) {

    this.requests[ request[0]*-1 ].promise.resolve.apply( this, request[2] );

    this.emit( '_request', request );

};