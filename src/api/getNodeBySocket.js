
dop.getNodeBySocket = function(socket) {
    return dop.data.node[ socket[dop.cons.TOKEN] ];
};