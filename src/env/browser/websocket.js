function websocket(dop, options) {
    var url = 'ws://localhost:4444/' + dop.name
    if (typeof options.url == 'string') url = options.url.replace('http', 'ws')
    else if (
        typeof window != 'undefined' &&
        typeof window.location != 'undefined' &&
        /http/.test(window.location.href)
    ) {
        var domain_prefix = /(ss|ps)?:\/\/([^\/]+)\/?(.+)?/.exec(
                window.location.href
            ),
            protocol = domain_prefix[1] ? 'wss' : 'ws'
        url =
            protocol +
            '://' +
            domain_prefix[2].toLocaleLowerCase() +
            '/' +
            dop.name
    }

    var transport = dop.createTransport()
    var WebSocket = options.transport.getApi()
    ;(function reconnect(ws_client_old) {
        var keep_reconnecting = true
        var ws_client = new WebSocket(url)
        var send = ws_client.send.bind(ws_client)
        var close = function() {
            keep_reconnecting = false
            ws_client.close()
        }
        ws_client.addEventListener('open', function() {
            console.log('open')
            if (ws_client_old === undefined) {
                transport.onOpen(ws_client, send, close)
            } else {
                transport.onReconnect(ws_client_old, ws_client, send, close)
            }
        })
        ws_client.addEventListener('message', function(message) {
            transport.onMessage(ws_client, message.data)
        })
        ws_client.addEventListener('close', function() {
            transport.onClose(ws_client)
            if (keep_reconnecting) reconnect(ws_client)
        })
        ws_client.addEventListener('error', function(error) {
            keep_reconnecting = false
            transport.onError(ws_client, error)
        })
    })()

    return transport
}

websocket.getApi = function() {
    return window.WebSocket
}

module.exports = websocket
