

dop.on.call = function( user, request ) {
    
    var response = [ request[0] * -1 ];

    if (dop.util.typeof( request[2] ) == 'array' ) {
        
        var path = request[2],
            object_id = path.shift();
    
        if ( typeof dop.objects[ object_id ] == 'object' && dop.objects[ object_id ].users[user.token] === user ) {
            
            var fn = dop.util.get( dop.objects[ object_id ].object, path );
            if ( typeof fn == 'function' ) {

                response.push( dop.protocol.fulfilled );

                var params = request[3],
                    promise = { request: request, response: response, user: user };

                promise.resolve = dop.response.resolve.bind( promise );
                promise.reject = dop.response.reject.bind( promise );

                params.push( promise );

                return fn.apply( dop.objects[ object_id ].object, params );

            }
        }

    }

    response.push( dop.error.REJECT_CALL_NOT_EXISTS );

    user.send( JSON.stringify( response ) );

};