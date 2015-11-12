
// Send a new request
syncio[syncio.side].prototype.request = function() {

    var data = [ syncio.protocol.request, Array.prototype.slice.call(arguments, 0) ],
        request = syncio.request.call( this, data );

    this.send( this.syncio.stringify( request.data ) );

    return request.promise;
    
};