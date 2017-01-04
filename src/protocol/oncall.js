
dop.protocol.oncall = function(node, request_id, request) {
    dop.protocol.onfunction(node, request_id, request, function(permission) {
        return permission.subscriber===1;
    });
}