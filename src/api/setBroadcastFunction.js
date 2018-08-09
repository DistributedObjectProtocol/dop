dop.setBroadcastFunction = function(object, namefunction) {
    dop.util.invariant(
        dop.isRegistered(object),
        'Object passed to dop.setBroadcastFunction must be a registered object'
    )
    var path = dop.getObjectPath(object),
        object_id = path.shift()
    path.push(namefunction)
    dop.getObjectTarget(object)[namefunction] = function() {
        return dop.protocol.broadcast(object_id, path, arguments)
    }
    dop.getObjectTarget(object)[namefunction]._name =
        dop.cons.BROADCAST_FUNCTION
}
