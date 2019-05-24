dop.core.registerSubscriber = function(node, object, object_path_id) {
    var observer = dop.createObserver(function(mutations, shallWeEmitToNode) {
        var patch = dop.core.getPatch(mutations)
        dop.core.emitToNode(node, object_path_id, patch)
    })
    observer.observeAll(object)
    node.subscriber[object_path_id] = {
        observer: observer,
        object: object
    }
}

// object_data.node[node.token] = {
//     version: 0, // incremental integer for new patches
//     pending: [],
//     applied_version: 0, // last patch version applied correctly
//     applied: {}
// }
