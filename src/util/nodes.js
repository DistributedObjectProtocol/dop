export function localProcedureCall(fn, req, args, errorInstances) {
    function reject(error) {
        // https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
        for (let index = 0; index < errorInstances.length; ++index) {
            if (error instanceof errorInstances[index]) {
                throw error
            }
        }
        req.reject(error)
    }

    try {
        const output = fn.apply(req, args)
        if (output !== req) {
            output instanceof Promise
                ? output.then(req.resolve).catch(reject)
                : req.resolve(output)
        }
    } catch (error) {
        reject(error)
    }
}

export function createRequest() {
    let resolve
    let reject
    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })
    promise.resolve = resolve
    promise.reject = reject
    return promise
}

// function Request(executor) {
//     let resolve
//     let reject
//     const promise = new Promise((res, rej) => {
//         resolve = res
//         reject = rej
//         // return executor(res, rej)
//     })

//     promise.__proto__ = Request.prototype
//     promise.resolve = resolve
//     promise.reject = reject
//     return promise
// }

// Request.__proto__ = Promise
// Request.prototype.__proto__ = Promise.prototype
