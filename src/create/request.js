

syncio.create.prototype.request_create = function () {

    var data = Array.prototype.slice.call(arguments, 0),
    request_id = this.request_id++;
    data.unshift( request_id );
    return this.requests[ request_id ] = {
        id: request_id, 
        data: data, 
        promise: new syncio.promise()
    };

};


syncio.create.prototype.request = function () {
    var request = this.request_create.apply(this, arguments);
    return request.promise;
};