
dop.protocol.connect = function(node) {
    var request = dop.core.createRequest(node, dop.protocol.instructions.connect, node.token);
    dop.core.storeRequest(node, request);
    dop.core.emitRequests(node, JSON.stringify);
};