
// call method
dop.api.prototype.call = function( path, params ) {

    var data = [ dop.protocol.call, path, params ],
        request = dop.request.call( this, data );

    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;
    
};