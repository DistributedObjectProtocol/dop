
dop.core.onclose = function(listener_or_node, socket) {

    var isListener = (listener_or_node.socket !== socket),
        node = (isListener) ? dop.getNodeBySocket(socket) : listener_or_node;

    listener_or_node.emit('close', socket);

    if (dop.util.isObject(node)) {
        node.readyState = 0;
        listener_or_node.emit('disconnect', node);
        dop.core.unregisterNode(node);
    }

};
