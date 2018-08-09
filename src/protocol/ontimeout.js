dop.protocol.onsubscribetimeout = dop.protocol.onunsubscribetimeout = dop.protocol.oncalltimeout = dop.protocol.onbroadcasttimeout = function(
    node,
    request_id,
    request
) {
    request.promise.reject(dop.core.error.reject_local.TIMEOUT_REQUEST)
}
