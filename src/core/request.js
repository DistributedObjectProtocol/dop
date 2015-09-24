

syncio.request = function ( request_data ) {

    var request_id = this.request_id++;
    request_data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: request_data, 
        promise: new syncio.promise()
    };

};