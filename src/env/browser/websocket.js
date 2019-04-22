;(function(root) {
    function websocket(dop, options) {
        var url = 'ws://localhost:4444/' + dop.name
        if (typeof options.url == 'string') {
            url = options.url.replace('http', 'ws')
        } else if (
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
        if (typeof options.timeoutReconnect != 'number') {
            options.timeoutReconnect = 1 // seconds
        }

        var transport = dop.createTransport()
        var WebSocket = options.transport.getApi()
        ;(function reconnect(ws_client_old) {
            var keep_reconnecting = true
            var ws_client = new WebSocket(url)
            var send = function(message) {
                if (ws_client.readyState === 1) {
                    ws_client.send(message)
                    return true
                }
                return false
            }
            var close = function() {
                keep_reconnecting = false
                ws_client.close()
            }
            transport.socket = ws_client
            ws_client.addEventListener('open', function() {
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
                if (keep_reconnecting)
                    setTimeout(function() {
                        reconnect(ws_client)
                    }, options.timeoutReconnect)
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

    // UMD
    if (
        typeof module == 'object' &&
        module.exports &&
        !(
            typeof dop == 'object' &&
            typeof factory == 'function' &&
            dop.create === factory
        ) // this is true if we are inside of dop.factory
    ) {
        module.exports = websocket
    } else {
        websocket.getApi = function() {
            return window.WebSocket
        }
        typeof dop != 'undefined'
            ? (dop.transports.connect.websocket = websocket)
            : (root.dopTransportsConnectWebsocket = websocket)
    }
})(this)
