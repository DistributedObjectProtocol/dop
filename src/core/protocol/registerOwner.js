dop.core.registerOwner = function(node, object, object_owner_id) {
    node.owner[object_owner_id] = {
        object: object,
        applied_version: 0, // last patch version applied correctly
        applied: {}
    }
}
