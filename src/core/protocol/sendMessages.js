
dop.core.sendMessages = function(node) {
    var total = node.message_queue.length;
    if (total>0 && node.connected) {
        var index = 0,
            messages_wrapped = [],
            message_string;
        
        for (;index<total; ++index)
            messages_wrapped.push( node.message_queue[index][1](node.message_queue[index][0]) );

        
        message_string = (index>1) ? '['+messages_wrapped.join(',')+']' : messages_wrapped[0];

        node.message_queue = [];
        node.send(message_string);
    }
};



        // var index = 0,
        //     message = wrapper((total>1) ? requests : requests[0]);

        // for (;index<total; ++index)
        //     node.requests[requests[index][0]] = requests[index];

        // node.requests_queue = [];
        // node.send(message);