

syncio.on.request = function request( sender, request ) {

    var response = [ request[0] * -1, request[1] ];

    var promise = { request: request, response: response, sender: sender };
    promise.resolve = syncio.response.resolve.bind( promise );
    promise.reject = syncio.response.reject.bind( promise );

    var params = [ 'request' ];
    params = params.concat( request[2] );
    params.push(promise);

    this.emit.apply(this, params );

};