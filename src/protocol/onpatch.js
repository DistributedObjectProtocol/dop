dop.protocol.onpatch = function(node, request_id, request) {
    var object_id_owner = request[1],
        version = request[2],
        patch = request[3],
        owner = node.owner[object_id_owner],
        response = dop.core.createResponse(request_id),
        collector

    if (owner !== undefined) {
        // Storing patch
        if (
            owner.applied_version < version &&
            owner.applied[version] === undefined
        ) {
            // Storing patch
            owner.applied[version] = patch
            // Applying
            collector = dop.collect()
            while (owner.applied[owner.applied_version + 1]) {
                owner.applied_version += 1
                dop.core.setPatch(
                    owner.object,
                    owner.applied[owner.applied_version],
                    dop.core.setPatchFunctionMutator
                )
                delete owner.applied[owner.applied_version]
            }
            collector.emit()
        }
        response.push(0)
    } else response.push(dop.core.error.reject_remote.OBJECT_NOT_FOUND)

    dop.core.storeAndSendRequests(node, response)
}
