dop.collectGetters = function() {
    var stopCollect = dop.core.collectGettersPaths()
    return function stopCollectGetters() {
        var collecteds = stopCollect()
        var output = []
        var unique_paths = {}
        for (var index = 0; index < collecteds.length; ++index) {
            var object_collected = collecteds[index]
            var unique_path = dop.core.pathSeparator(object_collected.path)
            if (unique_paths[unique_path] === undefined) {
                unique_paths[unique_path] = true
                output.push({
                    object: dop.getObjectProxy(object_collected.object),
                    property: object_collected.property
                })
            }
        }
        return output
    }
}
