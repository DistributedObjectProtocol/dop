
dop.protocol.call = function(node, object_id, path, params) {

    var object_data = dop.data.object[object_id];

    if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].owner>0) {
        params = Array.prototype.slice.call(params, 0);
        var request = dop.core.createRequest(
            node,
            dop.protocol.instructions.call,
            object_data.node[node.token].owner,
            path,
            params
        );
        dop.core.storeSendMessages(node, request);
        return request.promise;
    }
    else
        return Promise.reject(dop.core.error.reject.OBJECT_NOT_FOUND);
};


dop.protocol.oncall = function(node, request_id, request) {
    var object_id = request[1],
        path = request[2],
        params = request[3],
        object_data = dop.data.object[object_id];

    if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].subscriber) {
        var f = dop.util.get(object_data.object, path);
        if (isFunction(f)) {
            dop.core.localProcedureCall(f, params, function(value) {
                var response = dop.core.createResponse(request_id, 0);
                if (value !== undefined)
                    response.push(value);
                dop.core.storeSendMessages(node, response);
                return value;
            }, function(err){
                dop.core.storeSendMessages(node, dop.core.createResponse(request_id, err));
            }, function(req) {
                req.node = node;
                return req;
            });
        }
    }
};


dop.protocol._oncall = function(node, request_id, request, response) {
    var rejection = response[0];
    if (rejection !== undefined) {
        (rejection !== 0) ?
            request.promise.reject(rejection)
        :
            request.promise.resolve(response[1]);
    }
};

