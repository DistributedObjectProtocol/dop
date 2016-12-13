// server side
dop.protocol._onconnect = function(node, request_id, request, response) {

    var token = request[2];

    // Node is connected correctly
    if (response[0]===0)
        node.emit(dop.cons.CONNECT, request, response);


    // We must manage the rejection
    // ....




    // // Resending token
    // else if (node.try_connects-- > 0) {
    //     delete dop.data.node[token];
    //     dop.protocol.connect(node);
    // }

    // // We disconnect the node because is rejecting too many times the token assigned
    // else {
    //     delete dop.data.node[token];
    //     node.listener.emit('warning', dop.core.error.warning.TOKEN_REJECTED);
    //     node.socket.close();
    // }

};