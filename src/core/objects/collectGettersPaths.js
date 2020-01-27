dop.core.collectGettersPaths = function() {
    var data = dop.data
    var gets_paths = data.gets_paths
    var items = []
    data.gets_collecting = true
    gets_paths.push(items)
    return function stopCollectGetters() {
        gets_paths.splice(gets_paths.indexOf(items), 1)
        data.gets_collecting = false
        return items
    }
}
