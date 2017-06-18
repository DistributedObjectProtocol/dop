
dop.core.localProcedureCall = function(f, args, resolve, reject, configureReq, scope) {
    var req = dop.core.createAsync(), output;
    if (isFunction(configureReq))
        req = configureReq(req);

    args.push(req);
    req.then(resolve).catch(reject);
    output = f.apply(scope||req, args);

    // Is sync
    if (output !== req)
        req.resolve(output);
};