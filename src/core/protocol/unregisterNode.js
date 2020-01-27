dop.core.unregisterNode = function(node) {
    delete dop.data.node[node.token]
    for (var object_path_id in node.subscriber)
        node.subscriber[object_path_id].observer.destroy()
}
