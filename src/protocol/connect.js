
dop.protocol.connect = function( node ) {
    var token, request;
    do {
        token = dop.util.uuid();
    } while( dop.util.typeof( dop.data.node[token] )=='object' );

    dop.data.node[token] = node;
    node.token = token;
    node.socket[dop.specialprop.socket_token] = token;

    request = dop.core.createRequest(node, dop.protocol.instructions.connect, token);
    dop.core.storeRequest(node, request);
    dop.core.emitRequests(node, JSON.stringify);
};


dop.core.storeRequest = function(node, request) {
    node.requests_queue.push( request );
};


dop.core.emitRequests = function(node, wrapper) {
    if (typeof wrapper != 'function')
        wrapper = dop.encode;

    var requests=node.requests_queue, index=0, total=requests.length;

    for (;index<total; ++index)
        node.requests[requests[index][0]] = requests[index];

    node.requests_queue = [];
    node.send(wrapper((total>1) ? requests : requests[0]));
};