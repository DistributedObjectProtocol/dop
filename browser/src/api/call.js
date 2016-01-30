
// call method
synko.api.prototype.call = function( path, params ) {

    var data = [ synko.protocol.call, path, params ],
        request = synko.request.call( this, data );

    this.send( synko.stringify.call(this, request.data ) );

    return request.promise;
    
};