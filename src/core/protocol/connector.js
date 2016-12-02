
dop.core.connector = function(args) {
    var node = new dop.core.node();
    args.unshift(dop, node);
    node.options = args[2];
    node.transport = node.options.transport;
    node.socket = node.options.transport.apply(this, args);
    node.reconnect = function() { // cant be attached because delete nodeinstance.subscribe does not work
        var oldSocket = node.socket;
        node.socket = node.options.transport.apply(node, args);
        node.send(dop.encode([2, 1, node.tokenServer]));
    };
    return node;
};
