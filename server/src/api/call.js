
// Send a new request
dop.api.prototype.call = function( path, params ) {

    var token, 
        users_n = 0, 
        users = dop.objects[path[0]].users,
        data = [ dop.protocol.call, path, params ],
        request = dop.request.call( this, data ),
        data_string = dop.stringify.call(this, request.data );

    for (token in users) {
        users_n += 1;
        users[token].send( data_string );
    }

    request.users = users_n;

    return request.promise;
    
};