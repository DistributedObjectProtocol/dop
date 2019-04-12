var test = require('tape')
var WebSocket = require('ws')
var dop = require('../.proxy').create()
// var dopServer = dop.create()
// var dopClient = dop.create()

const port = 8989
const wsServer = new WebSocket.Server({ port })
const wsClient = new WebSocket('ws://localhost:' + port)
const transportServer = new dop.core.transport(wsServer, 'SERVER')
const transportClient = new dop.core.transport(wsClient, 'CLIENT')

wsServer.on('connection', function(socket) {
    transportServer.onOpen(socket, socket.send)
    socket.on('message', function(message) {
        transportServer.onMessage(socket, message)
        transportServer.send(socket, message) // use this method rather than socket.send(message) to guarantee sending the message
    })
    socket.on('close', function() {
        transportServer.onClose(socket)
    })
})

wsClient.on('open', function open() {
    transportClient.onOpen(wsClient, wsClient.send)
    wsClient.on('message', function(message) {
        transportClient.onMessage(wsClient, message)
    })
    wsClient.send('hello')
})

// test('RECONNECT TEST', function(t) {
//     t.end()
// })
