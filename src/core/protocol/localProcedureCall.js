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
        if (output !== req) {
            output instanceof Promise
                ? output.then(req.resolve).catch(req.reject)
                : req.resolve(output)
        }
    } catch (e) {
        req.reject(e)
    }
}
