
dop.core.localProcedureCall = function(f, args, resolve, reject, compose) {

    var req = dop.core.createAsync(), output;
    if (typeof compose == 'function')
        req = compose(req);

    args.push(req);
    req.then(resolve).catch(reject);
    output = f.apply(req, args);

    // Is sync
    if (output !== req)
        req.resolve(output);

};