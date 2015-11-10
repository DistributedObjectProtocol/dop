

syncio.on._request = function _request( user, response ) {

    this.requests[ response[0]*-1 ].promise.resolve.apply( this, response[2] );

    this.emit( '_request', response );

};