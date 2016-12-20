
dop.protocol.onsubscribe = function(node, request_id, request) {

    if (isFunction(dop.data.onsubscribe)) {

        var args = Array.prototype.slice.call(request, 1);

        dop.core.localProcedureCall(dop.data.onsubscribe, args, function resolve(value) {
            if (isObject(value)) {
                var object = dop.register(value),
                    object_id = dop.getObjectId(object),
                    object_root = dop.getObjectRoot(object),
                    response = dop.core.createResponse(request_id, 0, dop.getObjectDop(object));

                if (dop.core.registerSubscriber(node, object_root))
                    response.push(object_root);
                dop.core.sendResponse(node, response);
                return object;
            }
            else {
                // http://www.2ality.com/2016/03/promise-rejections-vs-exceptions.html
                try {
                    dop.util.invariant(false, 'dop.onsubscribe callback must return or resolve a regular object');
                } catch(err) {
                    console.log( 123,err );
                    return reject(err);
                }
                // reject()
            }


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