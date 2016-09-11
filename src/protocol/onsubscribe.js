
dop.protocol.onsubscribe = function( node, request_id, request ) {

    if ( typeof dop.data.onsubscribe == 'function' ) {

        var args = Array.prototype.slice.call(request, 1), object, response;

        dop.core.localProcedureCall( node, dop.data.onsubscribe, args, function resolve( value ) {
            if ( value && typeof value == 'object' ) {
                object = dop.register( value );
                var object_id = dop.getObjectId(object);
                response = dop.core.createResponse(request_id, 0, object[dop.specialprop.dop]);
                if ( dop.core.registerObjectToNode(node, object) )
                    response.push( dop.data.object[object_id].object );
                node.send(dop.encode(response));
                return object;
            }
            else
                throw TypeError(dop.core.error.api.ONSUBSCRIBE_NOOBJECT_RESOLVED);

        }, function reject( error ){
            response = dop.core.createResponse( request_id );
            if ( error instanceof Error )
                console.log( error.stack );
            else
                response.push( error );
            node.send(JSON.stringify(response));
        });

    }

};