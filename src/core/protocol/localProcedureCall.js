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
        // var is_promise = output instanceof Promise
        // var output_is_req = output === req
        // var req_pending = req.pending

        if (output !== req) req.resolve(output)
    } catch (e) {
        // Is sync
        req.reject(e)
    }
}
