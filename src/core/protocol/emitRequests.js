
dop.core.emitRequests = function(node, wrapper) {
    if (typeof wrapper != 'function')
        wrapper = dop.encode;

    var requests=node.requests_queue, index=0, total=requests.length;

    for (;index<total; ++index)
        node.requests[requests[index][0]] = requests[index];

    node.requests_queue = [];
    node.send(wrapper((total>1) ? requests : requests[0]));
};