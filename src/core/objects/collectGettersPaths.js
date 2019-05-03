dop.core.collectGettersPaths = function() {
    var data = dop.data
    data.gets_collecting = true
    return function stopCollectGetters() {
        data.gets_collecting = false
        var paths = data.gets_paths
        data.gets_paths = []
        return paths
    }
}
