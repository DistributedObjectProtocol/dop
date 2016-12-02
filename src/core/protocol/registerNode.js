
dop.core.registerNode = function(node, tokenServer) {
    node.socket[CONS.socket_token] = node.token;
    dop.data.node[node.token] = node;
    if (tokenServer !== undefined)
        node.tokenServer = tokenServer;
};