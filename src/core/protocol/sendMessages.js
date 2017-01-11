
dop.core.sendMessages = function(node) {
    var total = node.message_queue.length;
    if (total>0 && node.connected) {
        var index = 0,
            messages_wrapped = [],
            message_string,
            message,
            request_id;
        
        for (;index<total; ++index) {
            message = node.message_queue[index][0];
            messages_wrapped.push( node.message_queue[index][1](message) );
            request_id = message[0]
            // If is a request (not a response) we set a timeout
            if (request_id>0) {
                var nameinstruction = dop.protocol.instructions[message[1]];
                message.timeout = setTimeout(function() {
                    // if (node.requests[request_id] !== undefined) {
                        dop.protocol['on'+nameinstruction+'timeout'](node, request_id, message);
                        delete node.requests[request_id];
                    // }
                }, dop.protocol.timeouts[nameinstruction]);
            }
        }

        
        message_string = (index>1) ? '['+messages_wrapped.join(',')+']' : messages_wrapped[0];

        node.message_queue = [];
        node.send(message_string);
    }
};