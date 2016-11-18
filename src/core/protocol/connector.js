
dop.core.connector = function(options) {
    var node = new dop.core.node();
    node.options = options;
    node.transport = options.transport;
    node.socket = options.transport(options, dop, node);
    return node;
};
