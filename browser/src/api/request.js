
// Send a new request
dop[dop.side].prototype.request = function() {

    var data = [ dop.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = dop.request.call( this.dop, data );

    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;
    
};