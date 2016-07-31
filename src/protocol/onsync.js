
dop.protocol.onsync = function( node, request_id, request ) {

    var object_name = request[1], response;


    // If object is not defined by object_name
    if ( dop.util.typeof(dop.data.object_onsync[object_name]) != 'object' ) {
        response = dop.core.createResponse( request_id, dop.core.error.reject.OBJECT_NAME_NOT_FOUND );
        node.send(JSON.stringify(response));
    }


    // If object_name has callback to process
    else if ( typeof dop.data.object_onsync[object_name].callback == 'function' ) {
        var args = Array.prototype.slice.call(request, 2),
        req = {
            node: node,
            resolve: function(object, options){
                var proxy = dop.core.registerObject(node, object, false, options ),
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
        dop.data.object_onsync[object_name].callback.apply(node, args);
    }



    // //
    // else if ( dop.data.object_onsync[object_name].callback === false ) {

    //     var object_data_name = dop.data.object_onsync[object_name];
    //     dop.core.registerNodeObject( 
    //         node,
    //         object_data_name.object_id,
    //         object_name,
    //         object_data_name.permissions,
    //         ref_id
    //     );
    //     response = dop.core.createResponse( 
    //         request_id,
    //         0,
    //         object_data_name.permissions,
    //         dop.data.object[object_data_name.object_id].object
    //     );

    //     node.send(dop.encode(response));
        
    // }

    


};
