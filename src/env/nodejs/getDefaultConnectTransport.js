dop.getDefaultConnectTransport = function() {
    return require('dop-transports').connect.websocket
}
