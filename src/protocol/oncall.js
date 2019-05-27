dop.protocol.oncall = function(node, request_id, request) {
    var object_id = request[1],
        path = request[2],
        params = request[3],
        subscriber = node.subscriber[object_id]

    if (isObject(subscriber)) {
        var function_name = path.pop(),
            object = dop.util.get(subscriber.object, path),
            f = object[function_name]

        if (isFunction(f)) {
            function resolve(value) {
                var response = dop.core.createResponse(request_id, 0)
                if (value !== undefined) response.push(value)
                dop.core.storeAndSendRequests(node, response)
                return value
            }
            function reject(err) {
                dop.core.storeAndSendRequests(
                    node,
                    dop.core.createResponse(
                        request_id,
                        dop.core.error.reject_remote.CUSTOM_REJECTION,
                        err
                    )
                )
            }

            if (dop.isRemoteFunction(f))
                f.apply(null, params)
                    .then(resolve)
                    .catch(reject)
            else
                dop.core.localProcedureCall(
                    f,
                    params,
                    resolve,
                    reject,
                    function(req) {
                        req.node = node
                        return req
                    },
                    dop.getObjectProxy(object)
                )

            return
        }
    }

    dop.core.storeAndSendRequests(
        node,
        dop.core.createResponse(
            request_id,
            dop.core.error.reject_remote.FUNCTION_NOT_FOUND
        )
    )
}
