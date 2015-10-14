
// Send a new request
syncio.user.prototype.request = function () {

    var request, args = Array.prototype.slice.call(arguments, 0);
    args.unshift( syncio.protocol.request );
    request = syncio.request.call(this.syncio, args);
    this.send( JSON.stringify( request.data ) );
    return request.promise;
    
};