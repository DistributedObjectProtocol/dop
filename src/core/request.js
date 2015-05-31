

syncio.request = function () {

    var request = Array.prototype.slice.call(arguments, 0),
    request_id = this.request_id++;
    request.unshift( this.request_id++ );
    this.requests[ request_id ] = {request: request, total: 1};
    return request;

};