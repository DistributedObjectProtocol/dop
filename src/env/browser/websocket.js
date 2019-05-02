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

        var transport = dop.createTransport()
        var WebSocket = options.transport.getApi()
        ;(function reconnect() {
            var socket = new WebSocket(url)
            function send(message) {
                socket.send(message)
            }
            function disconnect() {
                socket.close()
            }
            var node = transport.onCreate(socket, send, disconnect)
            socket.addEventListener('open', function() {
                transport.onConnect(node)
            })
            socket.addEventListener('message', function(message) {
                transport.onMessage(node, message.data)
            })
            socket.addEventListener('close', function() {
                transport.onDisconnect(node)
            })
            socket.addEventListener('error', function(error) {
                transport.onError(node, error)
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
