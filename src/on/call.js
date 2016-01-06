

syncio.on.call = function( user, request ) {
    
    var response = [ request[0] * -1 ];

    if (syncio.util.typeof( request[2] ) == 'array' ) {
        
        var path = request[2],
            object_id = path.shift();
    
        if ( typeof syncio.objects[ object_id ] == 'object' && syncio.objects[ object_id ].users[user.token] === user ) {
            
            var fn = syncio.util.get( syncio.objects[ object_id ].object, path );
            if ( typeof fn == 'function' ) {

                response.push( request[1] );

                var params = request[3],
                
                promise = { request: request, response: response, user: user };
                promise.resolve = syncio.response.resolve.bind( promise );
                promise.reject = syncio.response.reject.bind( promise );

                params.push( promise );

                return fn.apply( syncio.objects[ object_id ].object, params );

            }
        }

    }

    response.push( syncio.error.REJECT_CALL_NOT_EXISTS );

    user.send( JSON.stringify( response ) );

};