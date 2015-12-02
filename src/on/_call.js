

syncio._on.call = function( user, response ) {

    var request_id = response[0]*-1;
    
    if (this.requests[ request_id ].users === 1 )
        this.requests[ request_id ].promise.resolve.apply( this, response[2] );
    else
        this.requests[ request_id ].promise.multiresolve.apply( this, response[2] );

};