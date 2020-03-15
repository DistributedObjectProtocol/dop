import { isFunction, isInteger, isArray } from '../util/is'
import createRequest from '../util/createRequest'
import localProcedureCall from '../util/localProcedureCall'

export default function createNodeFactory({ encode, decode }) {
    return function createNode({
        serialize = JSON.stringify,
        deserialize = JSON.parse,
        max_remote_functions = Infinity
    } = {}) {
        const requests = {}
        const local_functions_id = {}
        const local_functions = new Map()
        const remote_functions_id = {}
        const remote_functions = new Set()
        let local_function_index = 0
        let remote_function_index = 0
        let request_id_index = 0

        // encode / decode params
        const encode_params = {
            remote_functions,
            local_functions,
            registerLocalFunctionFromEncode
        }
        const decode_params = {
            remote_functions_id,
            createRemoteFunction
        }

        function registerLocalFunction(function_id, fn) {
            local_functions_id[function_id] = fn
            local_functions.set(fn, function_id)
            return function_id
        }

        function createRemoteFunction(function_id) {
            if (remote_functions.size / 2 >= max_remote_functions) {
                return null
            }
            const makeCall = (request_id, args) => {
                const data = [request_id, function_id]
                if (args.length > 0) data.push(args)
                api.send(encode(data, encode_params))
                return data
            }
            const fn = (...args) => {
                const request_id = ++request_id_index
                const req = createRequest()
                const { resolve, reject } = req
                const resolveOrReject = (fn, value) => {
                    fn(value)
                    delete requests[request_id]
                    return req
                }
                req.data = makeCall(request_id, args)
                req.node = api
                req.createdAt = new Date().getTime()
                req.resolve = value => resolveOrReject(resolve, value)
                req.reject = error => resolveOrReject(reject, error)
                requests[request_id] = req
                return req
            }
            fn.stub = (...args) => {
                makeCall(0, args)
            }

            remote_functions.add(fn)
            remote_functions.add(fn.stub)
            remote_functions_id[function_id] = fn
            return fn
        }

        function open(send, fn) {
            const remote_function_id = remote_function_index++
            const local_function_id = local_function_index++
            api.send = msg => send(serialize(msg))
            if (isFunction(fn)) registerLocalFunction(local_function_id, fn)
            return createRemoteFunction(remote_function_id)
        }

        function message(msg) {
            msg = deserialize(msg)
            if (!isArray(msg)) return false
            msg = decode(msg, decode_params)

            let [id, function_id, args] = msg
            const response_id = -id

            if (isInteger(id)) {
                const fn = local_functions_id[function_id]

                if (id > -1 && isFunction(fn)) {
                    args = isArray(msg[2]) ? msg[2] : []

                    // Request without response
                    if (id === 0) {
                        const req = { node: api }
                        args.push(req)
                        fn.apply(req, args)
                    }

                    // Request
                    else {
                        const req = createRequest()
                        const response = [response_id]
                        req.node = api
                        req.then(value => {
                            response.push(0) // no errors
                            if (value !== undefined) response.push(value)
                            api.send(encode(response, encode_params))
                        }).catch(error => {
                            response.push(error === 0 ? null : error)
                            api.send(encode(response, encode_params))
                        })
                        args.push(req)
                        localProcedureCall(fn, req, args)
                    }
                    return true
                }

                // Response
                else if (id < 0 && requests.hasOwnProperty(response_id)) {
                    const response_status = function_id
                    const req = requests[response_id]
                    response_status === 0
                        ? req.resolve(args)
                        : req.reject(response_status)
                    return true
                }
            }
            return false
        }

        function registerLocalFunctionFromEncode(fn) {
            return registerLocalFunction(local_function_index++, fn)
        }

        const api = {
            open,
            message,
            requests,
            remote_functions // Exposing this can be used to know if a function is a remote function
        }

        return api
    }
}
