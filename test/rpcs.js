import test from 'ava'
import { createNode } from '../src'

const localFunctions = {
    okSync: function (req) {
        return 'Ok'
    },
    okAsync: async function (req) {
        return 'Ok'
    },
    okPromise: function (req) {
        return new Promise(function (resolve, reject) {
            resolve('Ok')
        })
    },

    undefinedSync: function (req) {},
    undefinedAsync: async function (req) {},
    undefinedPromise: function (req) {
        return new Promise(function (resolve, reject) {
            resolve(undefined)
        })
    },

    errorSync: function (req) {
        throw 'Error'
    },
    errorAsync: async function (req) {
        throw 'Error'
    },
    errorPromise: function (req) {
        return new Promise(function (resolve, reject) {
            reject('Error')
        })
    },

    timeoutSync: function (req) {
        setTimeout(function () {
            req.resolve('Ok')
        }, 10)
        return req
    },
    timeoutAsync: async function (req) {
        setTimeout(function () {
            req.resolve('Ok')
        }, 10)
        return req
    },
    timeoutPromise: async function (req) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                req.resolve('Ok')
            }, 10)
            resolve(req)
        })
    },

    reqresolveSync: function (req) {
        return req.resolve('ok')
    },
    reqresolveAsync: async function (req) {
        return req.resolve('ok')
    },
    reqresolvePromise: function (req) {
        return new Promise(function (resolve, reject) {
            resolve(req.resolve('ok'))
        })
    },

    presolveSync: function (req) {
        return Promise.resolve('ok')
    },
    presolveAsync: async function (req) {
        return Promise.resolve('ok')
    },
    presolvePromise: function (req) {
        return new Promise(function (resolve, reject) {
            resolve(Promise.resolve('ok'))
        })
    },

    reqrejectSync: function (req) {
        return req.reject('Error')
    },
    reqrejectAsync: async function (req) {
        return req.reject('Error')
    },
    reqrejectPromise: function (req) {
        return new Promise(function (resolve, reject) {
            reject(req.reject('Error'))
        })
    },

    prejectSync: function (req) {
        return Promise.reject('Error')
    },
    prejectAsync: async function (req) {
        return Promise.reject('Error')
    },
    prejectPromise: function (req) {
        return new Promise(function (resolve, reject) {
            resolve(Promise.reject('Error'))
        })
    },

    referenceError: function () {
        functionThatDoesNotExists()
    },

    throwError: function () {
        throw new Error('whatever')
    },

    throwErrorAsync: async function () {
        throw new Error('async whatever')
    },

    throwErrorAsyncRemote: async function () {
        throw new Error('async whatever')
    },

    throwUndefined: function () {
        throw undefined
    },

    throwNull: function () {
        throw null
    },

    throwZero: function () {
        throw 0
    },
}

const server = createNode()
const client = createNode()
let remoteFunctions
client.open(server.message, (r) => {
    remoteFunctions = r
})
const callClient = server.open(client.message)
callClient(localFunctions)

test('throw a real error from async/await local', async function (t) {
    try {
        await localFunctions.throwErrorAsync()
        t.true(false)
    } catch (e) {
        t.true(e instanceof Error)
    }
})

// Don't know how to test this because it should break the script
test.skip('throw a real error from async/await remote', async function (t) {
    try {
        await remoteFunctions.throwErrorAsyncRemote()
        t.true(true)
    } catch (e) {
        t.true(false)
    }
})

test('Matching same values', async function (t) {
    t.deepEqual(Object.keys(remoteFunctions), Object.keys(localFunctions))
})

test('Ok', async function (t) {
    t.is(await remoteFunctions.okSync(), await remoteFunctions.okAsync())
    t.is(await remoteFunctions.okSync(), await remoteFunctions.okPromise())
    t.is(await remoteFunctions.okSync(), await localFunctions.okSync())
    t.is(await remoteFunctions.okAsync(), await localFunctions.okAsync())
    t.is(await remoteFunctions.okPromise(), await localFunctions.okPromise())
})

test('Error', async function (t) {
    t.is(1, 1)
    try {
        await remoteFunctions.errorSync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await remoteFunctions.errorAsync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await remoteFunctions.errorPromise()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }

    try {
        await localFunctions.errorSync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await localFunctions.errorAsync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await localFunctions.errorPromise()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
})

test('timeout', async function (t) {
    t.is(
        await remoteFunctions.timeoutSync(),
        await remoteFunctions.timeoutAsync()
    )
    t.is(
        await remoteFunctions.timeoutSync(),
        await remoteFunctions.timeoutPromise()
    )
})

test('req.resolve', async function (t) {
    t.is(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolveAsync()
    )
    t.is(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolvePromise()
    )
})

test('Promise.resolve', async function (t) {
    t.is(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolveAsync()
    )
    t.is(
        await remoteFunctions.reqresolveSync(),
        await remoteFunctions.reqresolvePromise()
    )
})

test('req.reject', async function (t) {
    try {
        await remoteFunctions.reqrejectSync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await remoteFunctions.reqrejectAsync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await remoteFunctions.reqrejectPromise()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
})

test('Promise.reject', async function (t) {
    try {
        await remoteFunctions.prejectSync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await remoteFunctions.prejectAsync()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
    try {
        await remoteFunctions.prejectPromise()
        t.is(1, 2, 'this should not happen')
    } catch (e) {
        t.is(e, 'Error')
    }
})

test('Undefined', async function (t) {
    t.is(
        await remoteFunctions.undefinedSync(),
        await remoteFunctions.undefinedAsync()
    )
    t.is(
        await remoteFunctions.undefinedSync(),
        await remoteFunctions.undefinedPromise()
    )
    t.is(
        await remoteFunctions.undefinedSync(),
        await localFunctions.undefinedSync()
    )
    t.is(
        await remoteFunctions.undefinedAsync(),
        await localFunctions.undefinedAsync()
    )
    t.is(
        await remoteFunctions.undefinedPromise(),
        await localFunctions.undefinedPromise()
    )
})

test('throw "Error"', async function (t) {
    try {
        remoteFunctions.errorSync().catch(() => {})
        t.true(true)
    } catch (e) {
        t.true(false)
    }
    try {
        await remoteFunctions.errorSync()
        t.true(false)
    } catch (e) {
        t.is(e, 'Error')
    }
})

test('ReferenceError error', async function (t) {
    try {
        remoteFunctions.referenceError()
        t.true(false)
    } catch (e) {
        t.true(e instanceof ReferenceError)
    }
    try {
        await remoteFunctions.referenceError()
        t.true(false)
    } catch (e) {
        t.true(e instanceof ReferenceError)
    }
})

test('throw new Error()', async function (t) {
    try {
        localFunctions.throwError()
        t.true(false)
    } catch (e) {
        t.true(e instanceof Error)
    }
    try {
        await remoteFunctions.throwError()
        t.true(false)
    } catch (e) {
        t.true(e instanceof Error)
    }
})

test('throwUndefined', async function (t) {
    try {
        localFunctions.throwUndefined()
        t.true(false)
    } catch (e) {
        t.is(e, undefined)
    }
    try {
        await remoteFunctions.throwUndefined()
        t.true(false)
    } catch (e) {
        t.is(e, null)
    }
})

test('throwNull', async function (t) {
    try {
        localFunctions.throwNull()
        t.true(false)
    } catch (e) {
        t.is(e, null)
    }
    try {
        await remoteFunctions.throwNull()
        t.true(false)
    } catch (e) {
        t.is(e, null)
    }
})

test('throwZero', async function (t) {
    try {
        localFunctions.throwZero()
        t.true(false)
    } catch (e) {
        t.is(e, 0)
    }
    try {
        await remoteFunctions.throwZero('lel')
        t.true(false)
    } catch (e) {
        t.is(e, null)
    }
})
