var test = require('tape')
var WebSocket = require('ws')
var dop = require('../.proxy').create()
// var dopServer = dop.create()
// var dopClient = dop.create()

const port = 8989
const transportServer = new dop.core.transport()
const transportClient = new dop.core.transport()

// SERVER
const wsServer = new WebSocket.Server({ port })
wsServer.on('connection', function(socket) {
    transportServer.onOpen(socket, socket.send.bind(socket)) // do not send any message before onOpen
    socket.on('message', function(message) {
        transportServer.onMessage(socket, message)
    })
    socket.on('close', function() {
        transportServer.onClose(socket)
    })
    // setTimeout(socket.close.bind(socket), 5000)
})

// CLIENT
;(function reconnect(wsClientOld) {
    const wsClient = new WebSocket('ws://localhost:' + port)
    const send = wsClient.send.bind(wsClient)
    wsClient.on('open', function() {
        if (wsClientOld === undefined) {
            transportClient.onOpen(wsClient, send)
        } else {
            transportClient.onReconnect(wsClientOld, wsClient, send)
        }
        wsClient.on('message', function(message) {
            transportClient.onMessage(wsClient, message)
        })
        wsClient.on('close', function() {
            transportClient.onClose(wsClient)
            reconnect(wsClient)
        })
    })
})()

transportServer.type = 'SERVER'
transportClient.type = 'CLIENT'
// test('RECONNECT TEST', function(t) {
//     t.end()
// })
