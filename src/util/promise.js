

syncio.promise = function( request ) {

    var deferred = {},
    promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject  = reject;
    });
    promise.deferred = deferred;

    if (typeof request == 'function')
        request.call(promise, deferred.resolve, deferred.reject);

    return promise;

};