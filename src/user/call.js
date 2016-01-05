
// Send a new request
syncio.user.prototype.call = function( path, params ) {

    var data = [ syncio.protocol.call, path, params ],
        request = syncio.request.call( this.syncio, data );

    this.send( syncio.stringify.call(this, request.data ) );

    return request.promise;
    
};