dop.createTransport = function(socket, close) {
    return new dop.core.transport(socket, close)
}
