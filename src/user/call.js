
// Send a new request
syncio.user.prototype.call = function( path, params ) {

    var data = [ syncio.protocol.call, path, params ],
        request = syncio.request.call( this.syncio, data );

    this.send( this.syncio.stringify( request.data ) );

    return request.promise;
    
};