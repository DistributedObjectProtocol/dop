

syncio.on.reject = function( user, response ) {

    user.requests[ response[0]*-1 ].promise.reject.apply( this, response[2] );

};