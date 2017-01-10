
dop.protocol.onpatchtimeout = function(node, request_id, request) {
    dop.protocol.patchSend(node, request[2], request[3], request[4]);
};