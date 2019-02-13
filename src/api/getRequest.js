dop.getRequest = function(args) {
    args = Array.prototype.slice.call(args, 0)
    var request = args[args.length - 1]
    if (
        request instanceof Promise &&
        request.hasOwnProperty('resolve') &&
        request.hasOwnProperty('reject')
    )
        return request

    return dop.core.createAsync()
}
