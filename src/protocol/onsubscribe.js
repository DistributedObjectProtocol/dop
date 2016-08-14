
dop.protocol.onsubscribe = function( node, request_id, request ) {

    var object_name = request[1], response;

    // If object is not defined by object_name
    if ( typeof dop.data.object_onsubscribe[object_name] == 'undefined' ) {
        response = dop.core.createResponse( request_id, dop.core.error.reject.OBJECT_NAME_NOT_FOUND );
        node.send(JSON.stringify(response));
    }


    // If object_name has callback to process
    else if ( typeof dop.data.object_onsubscribe[object_name] == 'function' ) {
        var args = Array.prototype.slice.call(request, 2),
        req = {
            node: node,
            resolve: function(object, options){
                var proxy = dop.core.registerObject(object, false, options ),
                object_id = proxy[dop.specialkey.object_path][0];
                dop.core.registerNodeObject(node, object_id, object_name);
                response = dop.core.createResponse(request_id, 0, object_id, object);
                node.send(dop.encode(response));
                return proxy;
            },
            reject: function(reason) {
                response = dop.core.createResponse( request_id, reason );
                node.send(JSON.stringify(response));
            }
        };
        args.push(req);
        dop.data.object_onsubscribe[object_name].apply(node, args);
    }



    // If object_name is already registered and we have the object_id
    else if ( typeof dop.data.object_onsubscribe[object_name] === 'number' ) {
        var object_id = dop.data.object_onsubscribe[object_name],
            object = dop.data.object[object_id].object,
            response = dop.core.createResponse(request_id, 0, object_id, object);
        dop.core.registerNodeObject(node, object_id, object_name);
        node.send(dop.encode(response));
    }


};
