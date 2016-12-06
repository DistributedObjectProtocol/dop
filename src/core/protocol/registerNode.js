
dop.core.registerNode = function(node) {
    node.socket[CONS.socket_token] = node.token;
    dop.data.node[node.token] = node;
};