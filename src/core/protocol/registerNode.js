
dop.core.registerNode = function(node, token) {
    node.status = 1;
    node.token = token;
    node.socket[CONS.socket_token] = token;
    dop.data.node[token] = node;  
};