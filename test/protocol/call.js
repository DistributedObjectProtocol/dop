var test = require('tape')
var dopServer = require('../.proxy').create()
var dopClient = require('../.proxy').create()
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

var localFunctions = dopServer.register({
    syncOk: function(req) {
        return 'Ok'
    },

    syncError: function(req) {
        throw 'Error'
    },

    syncUndefined: function(re) {
        // return
    },

    syncReqOk: function(req) {
        return req.resolve('Ok')
    },

    syncReqError: function(req) {
        return req.reject('Error')
    },

    syncTimeoutOk: function(req) {
        setTimeout(function() {
            req.resolve('Ok')
        }, 10)
        return req
    },

    syncTimeoutError: function(req) {
        setTimeout(function() {
            req.reject('Error')
        }, 10)
        return req
    },

    syncPromiseOk: function(req) {
        return Promise.resolve('Ok')
    },

    syncPromiseError: function(req) {
        return Promise.reject('Error')
    },

    // Async
    asyncOk: function(req) {
        return new Promise(function(resolve, reject) {
            resolve('Ok')
        })
    },

    asyncError: function(req) {
        return new Promise(function(resolve, reject) {
            reject('Error')
        })
    },

    asyncUndefined: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(undefined)
        })
    },

    asyncReqOk: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(req.resolve('Ok'))
        })
    },

    asyncReqError: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(req.reject('Error'))
        })
    },

    // asyncTimeoutOk: function(req) {
    //     return new Promise(function(resolve, reject) {
    //         setTimeout(function() {
    //             req.resolve('Ok')
    //         }, 10)
    //         resolve(req)
    //     })
    // },

    // asyncTimeoutError: function(req) {
    //     return new Promise(function(resolve, reject) {
    //         setTimeout(function() {
    //             req.reject('Error')
    //         }, 10)
    //         resolve(req)
    //     })
    // },

    asyncPromiseOk: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(Promise.resolve('Ok'))
        })
    },

    asyncPromiseError: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(Promise.reject('Error'))
        })
    }
})

// server
dopServer.onSubscribe(function() {
    return localFunctions
})

var remoteFunctions
test('Matching same values', function(t) {
    remoteFunctions = client.subscribe().then(function(o) {
        remoteFunctions = o
        t.deepEqual(Object.keys(remoteFunctions), Object.keys(localFunctions))
        t.end()
    })
})

test('syncOk', function(t) {
    remoteFunctions.syncOk().then(function(dataremote) {
        var datalocal = localFunctions.syncOk()
        t.equal(dataremote, 'Ok')
        t.equal(dataremote, datalocal)
        t.end()
    })
})

test('syncError', function(t) {
    remoteFunctions
        .syncError()
        .then(function(dataremote) {
            t.equal(1, 2, 'this should not happen')
        })
        .catch(function(e) {
            t.equal(e, 'Error')
            try {
                localFunctions.syncError()
                t.equal(1, 2, 'this should not happen 2')
            } catch (e) {
                t.equal(e, 'Error')
            }
            t.end()
        })
})

test('syncUndefined', function(t) {
    remoteFunctions.syncUndefined().then(function(dataremote) {
        var datalocal = localFunctions.syncUndefined()
        t.equal(dataremote, undefined)
        t.equal(dataremote, datalocal)
        t.end()
    })
})

test('syncReqOk', function(t) {
    remoteFunctions.syncReqOk().then(function(dataremote) {
        t.equal(dataremote, 'Ok')
        t.end()
    })
})

test('syncReqError', function(t) {
    remoteFunctions
        .syncReqError()
        .then(function(dataremote) {
            t.equal(1, 2, 'this should not happen')
        })
        .catch(function(e) {
            t.equal(e, 'Error')
            t.end()
        })
})

test('syncTimeoutOk', function(t) {
    remoteFunctions.syncTimeoutOk().then(function(dataremote) {
        t.equal(dataremote, 'Ok')
        t.end()
    })
})

test('syncTimeoutError', function(t) {
    remoteFunctions
        .syncTimeoutError()
        .then(function(dataremote) {
            t.equal(1, 2, 'this should not happen')
        })
        .catch(function(e) {
            t.equal(e, 'Error')
            t.end()
        })
})

test('syncPromiseOk', function(t) {
    remoteFunctions.syncPromiseOk().then(function(dataremote) {
        t.equal(dataremote, 'Ok')
        t.end()
    })
})

test('syncPromiseError', function(t) {
    remoteFunctions
        .syncPromiseError()
        .then(function(dataremote) {
            t.equal(1, 2, 'this should not happen')
        })
        .catch(function(e) {
            t.equal(e, 'Error')
            t.end()
        })
})

test('asyncOk', function(t) {
    remoteFunctions.asyncOk().then(function(dataremote) {
        t.equal(dataremote, 'Ok')
        t.end()
    })
})

test('asyncError', function(t) {
    remoteFunctions
        .asyncError()
        .then(function(dataremote) {
            t.equal(1, 2, 'this should not happen')
        })
        .catch(function(e) {
            t.equal(e, 'Error')
            t.end()
        })
})

test('asyncUndefined', function(t) {
    remoteFunctions.asyncUndefined().then(function(dataremote) {
        t.equal(dataremote, undefined)
        t.end()
    })
})

test('asyncReqOk', function(t) {
    remoteFunctions.asyncReqOk().then(function(dataremote) {
        t.equal(dataremote, 'Ok')
        t.end()
    })
})

test('asyncReqError', function(t) {
    remoteFunctions
        .asyncReqError()
        .then(function(dataremote) {
            t.equal(1, 2, 'this should not happen')
        })
        .catch(function(e) {
            t.equal(e, 'Error')
            t.end()
        })
})

// test('asyncTimeoutOk', function(t) {
//     remoteFunctions.asyncTimeoutOk().then(function(dataremote) {
//         t.equal(dataremote, 'Ok')
//         t.end()
//     })
// })

// test('asyncTimeoutError', function(t) {
//     remoteFunctions
//         .asyncTimeoutError()
//         .then(function(dataremote) {
//             t.equal(1, 2, 'this should not happen')
//         })
//         .catch(function(e) {
//             t.equal(e, 'Error')
//             t.end()
//         })
// })

test('asyncPromiseOk', function(t) {
    remoteFunctions.asyncPromiseOk().then(function(dataremote) {
        t.equal(dataremote, 'Ok')
        t.end()
    })
})

test('syncPromiseError', function(t) {
    remoteFunctions
        .syncPromiseError()
        .then(function(dataremote) {
            t.equal(1, 2, 'this should not happen')
        })
        .catch(function(e) {
            t.equal(e, 'Error')
            t.end()
        })
})
