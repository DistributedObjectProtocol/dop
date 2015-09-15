

syncio.api.prototype.request = function () {
    var request = syncio.request.apply(this, arguments);
    return request.promise;
};