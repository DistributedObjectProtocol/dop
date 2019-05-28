dop.protocol.onsubscribe = function(node, request_id, request) {
    if (isFunction(dop.data.onsubscribe)) {
        var params = Array.prototype.slice.call(request, 1)

        dop.core.localProcedureCall(
            dop.data.onsubscribe,
            params,
            function resolve(value) {
                if (dop.isPojoObject(value)) {
                    var response = dop.core.createResponse(request_id, 0)
                    var object = dop.register(value)
                    var object_path_id = dop.getObjectPathId(object)
                    // New object
                    if (node.subscriber[object_path_id] === undefined) {
                        dop.core.registerSubscriber(
                            node,
                            object,
                            object_path_id
                        )
                        response.push(object_path_id, object)
                    }
                    // Object already subscribed
                    else {
                        response.push(object_path_id)
                    }

                    dop.core.storeAndSendRequests(
                        node,
                        response,
                        dop.encodeFunction
                    )
                } else if (value === undefined) {
                    return Promise.reject(
                        dop.core.error.reject_remote.OBJECT_NOT_FOUND
                    )
                }
                // http://www.2ality.com/2016/03/promise-rejections-vs-exceptions.html
                // http://stackoverflow.com/questions/41254636/catch-an-error-inside-of-promise-resolver
                else {
                    dop.util.invariant(
                        false,
                        'dop.onSubscribe callback must return or resolve a regular object'
                    )
                }
            },
            reject,
            function(req) {
                req.node = node
                return req
            }
        )
    } else {
        reject(dop.core.error.reject_remote.OBJECT_NOT_FOUND)
    }

    function reject(error) {
        var response = dop.core.createResponse(request_id)
        error instanceof Error ? console.log(error.stack) : response.push(error)
        dop.core.storeAndSendRequests(node, response, JSON.stringify)
    }
}
