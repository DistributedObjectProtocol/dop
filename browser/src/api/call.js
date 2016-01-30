
// call method
syncio.api.prototype.call = function( path, params ) {

    var data = [ syncio.protocol.call, path, params ],
        request = syncio.request.call( this, data );

    this.send( syncio.stringify.call(this, request.data ) );

    return request.promise;
    
};