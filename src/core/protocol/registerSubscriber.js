dop.core.registerSubscriber = function(node, object, object_path_id) {
    var observer = dop.createObserver(function(mutations, shallWeEmitToNode) {
        var object_id,
            chunks,
            patch = dop.core.getPatch(mutations)
        for (object_id in patch) {
            chunks = patch[object_id].chunks
            dop.protocol.patch(node, object_path_id, chunks, subscriber)
        }
    })
    var subscriber = {
        observer: observer,
        object: object,
        version: 0, // incremental integer for new patches
        pending: []
    }
    observer.observeAll(object)
    node.subscriber[object_path_id] = subscriber
}

// object_data.node[node.token] = {
//     version: 0,
//     pending: [],
//     applied_version: 0, // last patch version applied correctly
//     applied: {}
// }
