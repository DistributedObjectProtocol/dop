
dop.core.onOpenClient = function(node, socket) {
    node.readyState = dop.CONS.OPEN;
    node.emit('open', socket);
    while (node.send_queue.length>0)
        node.send(node.send_queue.shift());
};


