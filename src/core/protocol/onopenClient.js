
dop.core.onOpenClient = function(node, socket) {
    node.emit('open', socket);
};


