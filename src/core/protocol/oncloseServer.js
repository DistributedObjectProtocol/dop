
dop.core.oncloseServer = function(listener, socket) {

    var node = dop.getNodeBySocket(socket);

    if (dop.util.isObject(node)) {
        // If is connected means it hasn't been disconnected manually by node.close(), so we must try to reconnect it
        if (node.readyState === dop.CONS.CONNECT)
            node.readyState = dop.CONS.RECONNECT; // reconnecting

        listener.emit('close', socket);
        
        if (node.readyState === dop.CONS.CLOSE) {
            listener.emit('disconnect', node);
            dop.core.unregisterNode(node);
        }
    }
    else
        listener.emit('close', socket);

};
