
dop.core.emitConnect = function(node) {
    node.connected = true;
    if (node.listener)
        node.listener.emit('connect', node);
    node.emit('connect');
};