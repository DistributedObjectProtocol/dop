

synko.on.reject = function( user, response ) {

    this.requests[ response[0]*-1 ].promise.reject.call( this, response[1] );

};