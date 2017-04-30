
// dop.setBroadcastFunction = function (object, namefunction) {
//     dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.setBroadcastFunction must be a registered object');
//     var path = dop.getObjectDop(object).slice(0),
//         object_id = path.shift();
//     path.push(namefunction);
//     dop.getObjectTarget(object)[namefunction] = function $DOP_BROADCAST_FUNCTION() {
//         return dop.protocol.broadcast(object_id, path, arguments);
//     }
// };