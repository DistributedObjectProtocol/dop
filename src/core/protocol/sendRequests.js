
dop.core.sendRequests = function(node, wrapper) {
    var requests = node.requests_queue,
        total = requests.length;
    
    if (total>0) {
        if (typeof wrapper != 'function')
            wrapper = dop.encode;

        var index = 0,
            message = wrapper((total>1) ? requests : requests[0]);

        for (;index<total; ++index)
            node.requests[requests[index][0]] = requests[index];

        node.requests_queue = [];
        node.send(message);
    }
};