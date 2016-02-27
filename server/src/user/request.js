
// Send a new request
synko[synko.side].prototype.request = function() {

    var data = [ synko.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = synko.request.call( this.synko, data );

    this.send( synko.stringify.call(this, request.data ) );

    return request.promise;
    
};