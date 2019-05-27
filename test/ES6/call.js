const test = require('tape')
const { connect } = require('../protocol/.connect.js')

const localFunctions = {
    okSync: function(req) {
        return 'Ok'
    },
    okAsync: async function(req) {
        return 'Ok'
    },
    okPromise: function(req) {
        return new Promise(function(resolve, reject) {
            resolve('Ok')
        })
    },

    undefinedSync: function(req) {},
    undefinedAsync: async function(req) {},
    undefinedPromise: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(undefined)
        })
    },

    errorSync: function(req) {
        throw 'Error'
    },
    errorAsync: async function(req) {
        throw 'Error'
    },
    errorPromise: function(req) {
        return new Promise(function(resolve, reject) {
            reject('Error')
        })
    },

    timeoutSync: function(req) {
        setTimeout(function() {
            req.resolve('Ok')
        }, 10)
        return req
    },
    timeoutAsync: async function(req) {
        setTimeout(function() {
            req.resolve('Ok')
        }, 10)
        return req
    },
    timeoutPromise: async function(req) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                req.resolve('Ok')
            }, 10)
            resolve(req)
        })
    },

    reqresolveSync: function(req) {
        return req.resolve('ok')
    },
    reqresolveAsync: async function(req) {
        return req.resolve('ok')
    },
    reqresolvePromise: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(req.resolve('ok'))
        })
    },

    presolveSync: function(req) {
        return Promise.resolve('ok')
    },
    presolveAsync: async function(req) {
        return Promise.resolve('ok')
    },
    presolvePromise: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(Promise.resolve('ok'))
        })
    },

    reqrejectSync: function(req) {
        return req.reject('Error')
    },
    reqrejectAsync: async function(req) {
        return req.reject('Error')
    },
    reqrejectPromise: function(req) {
        return new Promise(function(resolve, reject) {
            reject(req.reject('Error'))
        })
    },

    prejectSync: function(req) {
        return Promise.reject('Error')
    },
    prejectAsync: async function(req) {
        return Promise.reject('Error')
    },
    prejectPromise: function(req) {
        return new Promise(function(resolve, reject) {
            resolve(Promise.reject('Error'))
        })
    }
}

let remoteFunctions
let closeServer
test('Matching same values', async function(t) {
    const { dopServer, nodeClient, close } = await connect(
        t,
        false
    )
    closeServer = close
    dopServer.onSubscribe(() => localFunctions)
    remoteFunctions = await nodeClient.subscribe()
    t.deepEqual(Object.keys(remoteFunctions), Object.keys(localFunctions))
    t.end()
})

test('Ok', async function(t) {
    t.equal(await remoteFunctions.okSync(), await remoteFunctions.okAsync())
    t.equal(await remoteFunctions.okSync(), await remoteFunctions.okPromise())
    t.equal(await remoteFunctions.okSync(), await localFunctions.okSync())
    t.equal(await remoteFunctions.okAsync(), await localFunctions.okAsync())
    t.equal(await remoteFunctions.okPromise(), await localFunctions.okPromise())
    t.end()
})

test('Undefined', async function(t) {
    t.equal(
        await remoteFunctions.undefinedSync(),
        await remoteFunctions.undefinedAsync()
    )
    t.equal(
        await remoteFunctions.undefinedSync(),
        await remoteFunctions.undefinedPromise()
    )
    t.equal(
        await remoteFunctions.undefinedSync(),
        await localFunctions.undefinedSync()
    )
    t.equal(
        await remoteFunctions.undefinedAsync(),
        await localFunctions.undefinedAsync()
    )
    t.equal(
        await remoteFunctions.undefinedPromise(),
        await localFunctions.undefinedPromise()
    )
    t.end()
})

test('Error', async function(t) {
    try {
        await remoteFunctions.errorSync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await remoteFunctions.errorAsync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await remoteFunctions.errorPromise()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }

    try {
        await localFunctions.errorSync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await localFunctions.errorAsync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await localFunctions.errorPromise()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }

    t.end()
})

test('timeout', async function(t) {
    t.equal(
        await remoteFunctions.timeoutSync(),
        await remoteFunctions.timeoutAsync()
    )
    t.equal(
        await remoteFunctions.timeoutSync(),
        await remoteFunctions.timeoutPromise()
    )
    t.end()
})

test('req.resolve', async function(t) {
    t.equal(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolveAsync()
    )
    t.equal(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolvePromise()
    )
    t.end()
})

test('Promise.resolve', async function(t) {
    t.equal(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolveAsync()
    )
    t.equal(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolvePromise()
    )
    t.end()
})

test('req.reject', async function(t) {
    try {
        await remoteFunctions.reqrejectSync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await remoteFunctions.reqrejectAsync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await remoteFunctions.reqrejectPromise()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }

    t.end()
})

test('Promise.reject', async function(t) {
    try {
        await remoteFunctions.prejectSync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await remoteFunctions.prejectAsync()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }
    try {
        await remoteFunctions.prejectPromise()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'Error')
    }

    t.end()
    closeServer()
})
