

dop.on.request = function( user, request ) {

    var response = [ request[0] * -1, dop.protocol.fulfilled ];

    var promise = { request: request, response: response, user: user };
    promise.resolve = dop.response.resolve.bind( promise );
    promise.reject = dop.response.reject.bind( promise );

    var params = [ 'request' ];
    params = params.concat( request[2] );
    params.push(promise);

    this.emit.apply(this, params );

};