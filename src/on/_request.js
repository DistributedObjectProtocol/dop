

syncio._on.request = function( user, response ) {

    user.requests[ response[0]*-1 ].promise.resolve.apply( this, response[2] );

};