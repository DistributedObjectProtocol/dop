
dop.core.node.prototype.subscribe = function( name ) {

    var args = Array.prototype.slice.call(arguments, 0), request;
    args.unshift( this, dop.protocol.actions.subscribe );

    request = dop.core.createRequest.apply(this, args);

    this.send( dop.encode(request) );

    return request.promise.stream;
};