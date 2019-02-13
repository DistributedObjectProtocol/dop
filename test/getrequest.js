var test = require('tape')
var dopServer = require('./.proxy').create()
var dopClient = require('./.proxy').create()
var transportName = process.argv[2] || 'local'
var transportListen = require('dop-transports').listen[transportName]
var transportConnect = require('dop-transports').connect[transportName]
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'

// this code would be in node.js
var server = dopServer.listen({ transport: transportListen })
// this code would be in browser
var client = dopClient.connect({
    transport: transportConnect,
    listener: server
})

var tGlobal // used to test outside tests clausures

var localFunctions = dopServer.register({
    checkRequestObject: function() {
        const request = dopServer.getRequest(arguments)
        tGlobal.equal(request instanceof Promise, true)
        tGlobal.equal(request.hasOwnProperty('resolve'), true)
        tGlobal.equal(request.hasOwnProperty('reject'), true)
        // tGlobal.equal(request.node instanceof dopServer.core.node, true)
    },
    checkRequestObjectAsArgs: function() {
        const args = Array.prototype.slice.call(arguments, 0)
        const request = dopServer.getRequest(args)
        tGlobal.equal(request instanceof Promise, true)
        tGlobal.equal(request.hasOwnProperty('resolve'), true)
        tGlobal.equal(request.hasOwnProperty('reject'), true)
        // tGlobal.equal(request.node instanceof dopServer.core.node, true)
    },
    checkNodePropertyRemote: function() {
        const request = dopServer.getRequest(arguments)
        tGlobal.equal(request instanceof Promise, true)
        tGlobal.equal(request.hasOwnProperty('resolve'), true)
        tGlobal.equal(request.hasOwnProperty('reject'), true)
        tGlobal.equal(request.node instanceof dopServer.core.node, true)
    },
    checkNodePropertyLocal: function() {
        const request = dopServer.getRequest(arguments)
        tGlobal.equal(request instanceof Promise, true)
        tGlobal.equal(request.hasOwnProperty('resolve'), true)
        tGlobal.equal(request.hasOwnProperty('reject'), true)
        tGlobal.equal(request.hasOwnProperty('node'), false)
    }
})

// server
dopServer.onSubscribe(function() {
    return localFunctions
})

var remoteFunctions
test('Subscribing', function(t) {
    client.subscribe().then(function(obj) {
        remoteFunctions = obj
        t.deepEqual(Object.keys(remoteFunctions), Object.keys(localFunctions))
        t.end()
    })
})

test('checkRequestObject', function(t) {
    tGlobal = t
    remoteFunctions.checkRequestObject()
    localFunctions.checkRequestObject()
    // t.equal()
    t.end()
})

test('checkRequestObjectAsArgs', function(t) {
    tGlobal = t
    remoteFunctions.checkRequestObject()
    localFunctions.checkRequestObject()
    // t.equal()
    t.end()
})

test('checkNodePropertyRemote', function(t) {
    tGlobal = t
    remoteFunctions.checkNodePropertyRemote()
    t.end()
})

test('checkNodePropertyLocal', function(t) {
    tGlobal = t
    localFunctions.checkNodePropertyLocal()
    t.end()
    server.listener.close()
})
