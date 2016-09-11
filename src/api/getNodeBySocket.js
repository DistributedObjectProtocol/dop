
dop.getNodeBySocket = function( socket ) {
    return dop.data.node[ socket[dop.specialprop.socket_token] ];
};