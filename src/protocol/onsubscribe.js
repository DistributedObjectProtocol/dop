
dop.protocol.onsubscribe = function(node, request_id, request) {

    if (isFunction(dop.data.onsubscribe)) {

        var args = Array.prototype.slice.call(request, 1), object, response;

        dop.core.localProcedureCall(dop.data.onsubscribe, args, function resolve(value) {
            if (isObject(value)) {
                object = dop.register(value);
                var object_id = dop.getObjectId(object);
                response = dop.core.createResponse(request_id, 0, dop.getObjectDop(object));
                if (dop.core.registerObjectToNode(node, object))
                    response.push(dop.getObjectRootById(object_id));
                node.send(dop.encode(response));
                return object;
            }
            else
                dop.util.invariant(false, 'dop.onsubscribe callback must return or resolve a regular object');


        }, function reject(error) {
            response = dop.core.createResponse(request_id);
            if (error instanceof Error)
                console.log(error.stack);
            else
                response.push(error);
            node.send(JSON.stringify(response));
        }, function(req) {
            req.node = node;
            return req;
        });

    }

};