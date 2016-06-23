

dop.core.node.prototype.sync = function( name ) {

    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift( this, dop.protocol.actions.sync );

    var request = dop.core.createRequest.apply(this, args);

    this.send( this.encode(request) );

    return request.promise;
};