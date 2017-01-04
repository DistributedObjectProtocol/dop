
dop.protocol.onbroadcast = function(node, request_id, request) {
    dop.protocol.onfunction(node, request_id, request, function(permission, object_id) {
        return permission.owner===object_id;
    });
};