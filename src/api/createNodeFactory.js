import { isFunction, isInteger, isString, isArray } from '../util/is'

export default function createNodeFactory(DJSON) {
    return function createNode() {
        const functions = {}
        const requests = {}
        let local_function_index = 0
        let remote_function_index = 0
        let request_id_index = 0

        function registerLocalFunction(f) {
            const function_id = local_function_index++
            functions[function_id] = f
            return function_id
        }

        function createRemoteFunction() {
            const function_id = remote_function_index++
            return function remoteFunction(...args) {
                const request_id = ++request_id_index
                const data = [request_id, function_id]
                const req = createRequest()
                if (args.length > 0) data.push(args)
                req.data = data
                requests[request_id] = req
                api.send(DJSON.stringify(data))
                return req
            }
        }

        function open(send, f) {
            api.send = send
            registerLocalFunction(f)
            return createRemoteFunction()
        }

        function message(msg) {
            // Parsing messages
            if (isString(msg) && msg[0] === '[') {
                // https://jsperf.com/slice-substr-substring-test
                try {
                    const [id, function_id, args] = DJSON.parse(msg)
                    if (isInteger(id)) {
                        const f = functions[function_id]
                        if (id > 0 && isFunction(f)) {
                            localProcedureCall(
                                f,
                                isArray(args) ? args : [],
                                value =>
                                    api.send(DJSON.stringify([-id, 0, value])),
                                error => api.send(DJSON.stringify([-id, error]))
                            )
                            return true
                        } else if (id < 0 && requests.hasOwnProperty(id * -1)) {
                            const request_id = id * -1
                            const response_status = function_id
                            const req = requests[request_id]
                            if (response_status === 0) {
                                req.resolve(args)
                            } else {
                                req.reject(response_status)
                            }
                            delete requests[request_id]
                            return true
                        }
                    }
                } catch (e) {}
            }
            return false
        }

        function close() {}

        const api = {
            open,
            message,
            close
        }

        return api
    }
}

function createRequest() {
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

function localProcedureCall(f, args, resolve, reject) {
    const req = createRequest()

    req.then(resolve).catch(reject)
    args.push(req)

    try {
        const output = f.apply(req, args)
        if (output !== req) {
            output instanceof Promise
                ? output.then(req.resolve).catch(req.reject)
                : req.resolve(output)
        }
    } catch (e) {
        // https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
        if (
            e instanceof Error ||
            (isFunction(AssertionError) && e instanceof AssertionError) ||
            (isFunction(RangeError) && e instanceof RangeError) ||
            (isFunction(ReferenceError) && e instanceof ReferenceError) ||
            (isFunction(SyntaxError) && e instanceof SyntaxError) ||
            (isFunction(TypeError) && e instanceof TypeError)
        ) {
            throw e
        }
        req.reject(e)
    }
}
