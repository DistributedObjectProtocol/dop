

syncio._on.request = function( user, response ) {

    this.requests[ response[0]*-1 ].promise.resolve.apply( this, response[2] );

};