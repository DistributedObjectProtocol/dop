dop.core.registerNode = function(node) {
    // Generating token
    do {
        node.token = dop.util.uuid(dop.cons.TOKEN_LENGTH)
    } while (typeof dop.data.node[node.token] == 'object')
    dop.data.node[node.token] = node
    // node.token = '_' + dop.env + (dop.inc = (dop.inc || 0) + 1) + '_'
    // node.token_local = dop.util.uuid(dop.cons.TOKEN_LENGTH / 2) // Pre token is used to combine with the remote pre token to generate the real token
}
