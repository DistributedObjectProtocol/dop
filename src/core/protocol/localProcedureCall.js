dop.core.localProcedureCall = function(
    f,
    args,
    resolve,
    reject,
    configureReq,
    scope
) {
    var req = dop.core.createAsync()

    if (isFunction(configureReq)) req = configureReq(req)

    req.then(resolve).catch(reject)
    args.push(req)

    try {
        var output = f.apply(scope || req, args)
        // Is sync
        if (output !== req) req.resolve(output)
    } catch (e) {
        // Is sync
        req.reject(e)
    }
}
