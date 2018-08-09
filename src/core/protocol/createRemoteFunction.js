dop.core.createRemoteFunction = function(node) {
    var f = function(object_id, path) {
        // // http://jsperf.com/dynamic-name-of-functions
        // return new Function(
        //     "var a=arguments;return function " + path[path.length-1] + "(){return a[0](a[1], a[2], a[3], arguments)}"
        // )(dop.protocol.call, node, object_id, path)
        var f2 = function $DOP_REMOTE_FUNCTION() {
            return dop.protocol.call(node, object_id, path, arguments)
        }
        f2._name = dop.cons.REMOTE_FUNCTION
        return f2
    }
    f._name = dop.cons.REMOTE_FUNCTION_UNSETUP
    return f
}
