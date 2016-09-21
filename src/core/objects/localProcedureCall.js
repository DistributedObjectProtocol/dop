
dop.core.localProcedureCall = function( node, f, args, resolve, reject ) {

    var req = dop.core.createAsync(), output;
    req.node = node;
    args.push( req );

    req.then(resolve).catch(reject);
    output = f.apply(req, args);

    // Is sync
    if ( output !== req )
        req.resolve( output );

};