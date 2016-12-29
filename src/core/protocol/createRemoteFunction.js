
dop.core.createRemoteFunction = function $DOP_REMOTE_FUNCTION_UNSETUP(node) {
    return function $DOP_REMOTE_FUNCTION_UNSETUP(object_id, path) {
        // // http://jsperf.com/dynamic-name-of-functions
        // return new Function(
        //     "var a=arguments;return function " + path[path.length-1] + "(){return a[0](a[1], a[2], a[3], arguments)}"
        // )(dop.protocol.call, node, object_id, path)
        return function $DOP_REMOTE_FUNCTION() {
            return dop.protocol.call(node, object_id, path, arguments);
        }
    }
};
dop.protocol.call = function(node, object_id, path, params) {

    var params = Array.prototype.slice.call(params, 0);

    console.log(node.token, dop.data.object[object_id].node[node.token].owner, path, params);
};
