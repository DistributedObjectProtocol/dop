import { isFunction, isInteger, isString, isArray } from '../util/is'

export default function createNodeFactory(DJSON) {
    const Func = DJSON.Function
    const stringify = DJSON.stringify
    const parse = DJSON.parse

    return function createNode() {
        const requests = {}
        const local_functions_id = {}
        const local_functions_map = new Map()
        const remote_functions_id = {}
        // const remote_functions_map = new Map()
        let local_function_index = 0
        let remote_function_index = 0
        let request_id_index = 0

        function registerLocalFunction(f) {
            const function_id = local_function_index++
            local_functions_id[function_id] = f
            local_functions_map.set(f, function_id)
            return function_id
        }

        function createRemoteFunction(function_id) {
            function remoteFunction(...args) {
                const request_id = ++request_id_index
                const data = [request_id, function_id]
                const req = createRequest()
                if (args.length > 0) data.push(args)
                req.data = data
                requests[request_id] = req
                api.send(stringify(data, stringifyReplacer))
                return req
            }
            remote_functions_id[function_id] = remoteFunction
            return remoteFunction
        }

        function open(send, f) {
            const remote_function_id = remote_function_index++
            api.send = send
            registerLocalFunction(f)
            return createRemoteFunction(remote_function_id)
        }

        function message(msg) {
            // Parsing messages
            if (isString(msg) && msg[0] === '[') {
                // https://jsperf.com/slice-substr-substring-test
                try {
                    let [id, function_id, args] = parse(msg, parseReplacer)
                    if (isInteger(id)) {
                        const f = local_functions_id[function_id]

                        // Request
                        if (id > 0 && isFunction(f)) {
                            const req = createRequest()
                            req.node = api
                            req.then(value =>
                                api.send(
                                    stringify(
                                        [-id, 0, value],
                                        stringifyReplacer
                                    )
                                )
                            ).catch(error =>
                                api.send(
                                    stringify([-id, error], stringifyReplacer)
                                )
                            )
                            args = isArray(args) ? args : []
                            args.push(req)
                            localProcedureCall(f, req, args)
                            return true
                        }

                        // Response
                        else if (id < 0 && requests.hasOwnProperty(id * -1)) {
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

        function stringifyReplacer(key, f) {
            if (Func.isValidToStringify(f)) {
                const function_id = local_functions_map.has(f)
                    ? local_functions_map.get(f)
                    : registerLocalFunction(f)
                return Func.stringifyReplacer(function_id)
            }
            return f
        }

        function parseReplacer(key, value) {
            if (Func.isValidToParse(value)) {
                const function_id = value[Func.key]
                const f = remote_functions_id[function_id]
                return isFunction(f) ? f : createRemoteFunction(function_id)
            }
            return value
        }

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

function localProcedureCall(f, req, args) {
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
