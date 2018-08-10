// Used by dop.protocol.oncall && dop.protocol.onbroadcast
dop.protocol.onfunction = function(
    node,
    request_id,
    request,
    object_id,
    validator
) {
    var path = request[2],
        params = request[3],
        object_data = dop.data.object[object_id]

    if (
        isObject(object_data) &&
        isObject(object_data.node[node.token]) &&
        validator(object_data.node[node.token])
    ) {
        var function_name = path.pop(),
            object = dop.util.get(object_data.object, path),
            f = object[function_name]
        if (isFunction(f) && !dop.isBroadcastFunction(f)) {
            function resolve(value) {
                var response = dop.core.createResponse(request_id, 0)
                if (value !== undefined) response.push(value)
                dop.core.storeSendMessages(node, response)
                return value
            }
            function reject(err) {
                dop.core.storeSendMessages(
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

    dop.core.storeSendMessages(
        node,
        dop.core.createResponse(
            request_id,
            dop.core.error.reject_remote.FUNCTION_NOT_FOUND
        )
    )
}
