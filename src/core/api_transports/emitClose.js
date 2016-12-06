
dop.core.emitClose = function(node) {
    if (node.listener)
        node.listener.emit('close', node);
    node.emit('close');
};