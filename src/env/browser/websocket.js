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
            options.timeoutReconnect = 1000 // ms
        }

        var transport = dop.createTransport()
        var WebSocket = options.transport.getApi()
        ;(function reconnect(socket_closed) {
            var keep_reconnecting = true
            var socket = new WebSocket(url)
            var socket_open = socket_closed
            var send = function(message) {
                if (socket.readyState === 1) {
                    socket.send(message)
                    return true
                }
                return false
            }
            var close = function() {
                keep_reconnecting = false
                socket.close()
            }
            socket.addEventListener('open', function() {
                socket_open = socket
                if (socket_closed === undefined) {
                    transport.onOpen(socket, send, close)
                } else {
                    transport.onReconnect(socket_closed, socket, send, close)
                }
            })
            socket.addEventListener('message', function(message) {
                transport.onMessage(socket, message.data)
            })
            socket.addEventListener('close', function() {
                transport.onClose(socket)
                if (keep_reconnecting) {
                    setTimeout(function() {
                        reconnect(socket_open)
                    }, options.timeoutReconnect)
                }
            })
            socket.addEventListener('error', function(error) {
                transport.onError(socket, error)
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
