
dop.core.registerNode = function( node, token ) {
    dop.data.node[token] = node;
    node.status = 1;
    node.token = token;
    node.socket[dop.specialprop.socket_token] = token;
};