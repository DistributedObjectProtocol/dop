
dop.core.emitConnect = function(node) {
    if (node.listener)
        node.listener.emit('connect', node);
    node.emit('connect');
};