
// Send a new request
syncio.api.prototype.call = function( path, params ) {

    var token, 
        users_n = 0, 
        users = syncio.objects[path[0]].users,
        data = [ syncio.protocol.call, path, params ],
        request = syncio.request.call( this, data ),
        data_string = syncio.stringify.call(this, request.data );

    for (token in users) {
        users_n += 1;
        users[token].send( data_string );
    }

    request.users = users_n;

    return request.promise;
    
};