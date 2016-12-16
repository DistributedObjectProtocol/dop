
dop.core.sendResponse = function(node, response, wrapper) {
    if (typeof wrapper != 'function')
        wrapper = dop.encode;
    node.send(wrapper(response));
};