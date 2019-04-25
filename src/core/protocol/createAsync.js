dop.core.createAsync = function() {
    var resolve,
        reject,
        promise = new Promise(function(res, rej) {
            resolve = res
            reject = rej
        })
    promise.resolve = resolve
    promise.reject = reject
    return promise
}
