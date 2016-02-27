

synko.on.request = function( user, request ) {

    var response = [ request[0] * -1, synko.protocol.fulfilled ];

    var promise = { request: request, response: response, user: user };
    promise.resolve = synko.response.resolve.bind( promise );
    promise.reject = synko.response.reject.bind( promise );

    var params = [ 'request' ];
    params = params.concat( request[2] );
    params.push(promise);

    this.emit.apply(this, params );

};