
dop.core.node.prototype.sync = function( name ) {

    var args = Array.prototype.slice.call(arguments, 0), request;
    args.unshift( this, dop.protocol.actions.sync );

    request = dop.core.createRequest.apply(this, args);

    this.send( dop.encode(request) );

    return request.promise;
};