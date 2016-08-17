
dop.protocol.onsubscribe2 = function( node, request_id, request ) {

    var object_name = request[1], response,
        object_onsubscribe = dop.data.object_onsubscribe;

    // If object is not defined by object_name
    if ( typeof object_onsubscribe[object_name] == 'undefined' ) {
        response = dop.core.createResponse( request_id, dop.core.error.reject.OBJECT_NAME_NOT_FOUND );
        node.send(JSON.stringify(response));
    }


    // If object_name is already registered
    else if ( typeof object_onsubscribe[object_name].object == 'object' ) {

        var object = object_onsubscribe[object_name].object,
            object_id = object[dop.specialkey.object_path][0],
            response;

        // If node is already subscribed to this object
        if (typeof node.object_id[object_id] != 'undefined' || (typeof dop.data.object[object_id] != 'undefined' && typeof dop.data.object[object_id].node[node.token] != 'undefined')) {
            response = dop.core.createResponse( request_id, dop.core.error.reject.OBJECT_ALREADY_SUBSCRIBED );
            return node.send(JSON.stringify(response));
        }

        response = dop.core.createResponse(request_id, 0, object_id, object);
        dop.register(object, object_onsubscribe[object_name].options )

        node.register(object_id, object_name);
        node.send(dop.encode(response));
    }


    // If object_name has callback to process
    else if ( typeof object_onsubscribe[object_name].object == 'function' ) {
        var args = Array.prototype.slice.call(request, 2),
        req = {
            node: node,
            resolve: function(object, options){
                var object_id = dop.register(object, options ),
                    object = dop.data.object[object_id].object;
                node.register(object_id, object_name);
                response = dop.core.createResponse(request_id, 0, object_id, object);
                node.send(dop.encode(response));
                return object;
            },
            reject: function(reason) {
                response = dop.core.createResponse( request_id, reason );
                node.send(JSON.stringify(response));
            }
        };
        args.push(req);
        object_onsubscribe[object_name].object.apply(node, args);
    }

};
