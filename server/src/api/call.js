
// Send a new request
synko.api.prototype.call = function( path, params ) {

    var token, 
        users_n = 0, 
        users = synko.objects[path[0]].users,
        data = [ synko.protocol.call, path, params ],
        request = synko.request.call( this, data ),
        data_string = synko.stringify.call(this, request.data );

    for (token in users) {
        users_n += 1;
        users[token].send( data_string );
    }

    request.users = users_n;

    return request.promise;
    
};