
dop.core.connect = function(options) {
    var node = new dop.core.node();
    node.options = options;
    node.transport = options.transport;
    node.socket = options.transport(node, options, dop);
    return node;
};
