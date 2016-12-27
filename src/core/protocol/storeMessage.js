
dop.core.storeMessage = function(node, message, wrapper) {
    if (typeof wrapper != 'function')
        wrapper = dop.encode;
    node.message_queue.push([message, wrapper]);
};