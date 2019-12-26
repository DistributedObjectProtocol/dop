import { isFunction, isInteger, isArray } from '../util/is'
import createRequest from '../util/createRequest'
import localProcedureCall from '../util/localProcedureCall'
import converter from '../util/converter'
import { NAME_REMOTE_FUNCTION } from '../const'
import Func from '../types/Function'

export default function createNodeFactory({ encoders, decoders }) {
    return function createNode({
        serialize = v => v,
        deserialize = v => v
    } = {}) {
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
            function f(...args) {
                const request_id = ++request_id_index
                const data = [request_id, function_id]
                const req = createRequest()
                const { resolve, reject } = req
                const re = (f, value) => {
                    f(value)
                    delete requests[request_id]
                    return req
                }
                if (args.length > 0) data.push(args)
                req.data = data
                req.node = api
                req.at = new Date().getTime()
                req.resolve = value => re(resolve, value)
                req.reject = error => re(reject, error)
                requests[request_id] = req
                api.send(serialize(encode(data)))
                return req
            }
            Object.defineProperty(f, 'name', {
                value: NAME_REMOTE_FUNCTION,
                writable: false
            })
            remote_functions_id[function_id] = f
            return f
        }

        function open(send, f) {
            const remote_function_id = remote_function_index++
            api.send = send
            api.opened = true
            if (isFunction(f)) registerLocalFunction(f)
            return createRemoteFunction(remote_function_id)
        }

        function message(msg) {
            if (api.opened) {
                try {
                    msg = decode(deserialize(msg))
                } catch (e) {
                    // Invalid array to deserialize or decode
                    return false
                }

                let [id, function_id, args] = msg
                const response_id = -id

                if (isInteger(id)) {
                    const f = local_functions_id[function_id]

                    // Request
                    if (id > 0 && isFunction(f)) {
                        const req = createRequest()
                        const response = [response_id]
                        req.node = api
                        req.then(value => {
                            response.push(0) // no errors
                            if (value !== undefined) response.push(value)
                            api.send(serialize(encode(response)))
                        }).catch(error => {
                            response.push(error) // error
                            api.send(serialize(encode(response)))
                        })
                        args = isArray(args) ? args : []
                        args.push(req)
                        localProcedureCall(f, req, args)
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
            }
            return false
        }

        function close() {
            api.opened = false
        }

        function encode(object) {
            return converter(
                object,
                encoders.concat(({ value }) =>
                    Func.encode({
                        value,
                        local_functions_map,
                        registerLocalFunction
                    })
                )
            )
        }

        function decode(object) {
            return converter(
                object,
                decoders.concat(({ value }) =>
                    Func.decode({
                        value,
                        remote_functions_id,
                        createRemoteFunction
                    })
                )
            )
        }

        const api = {
            open,
            message,
            close,
            opened: false,
            requests
        }

        return api
    }
}
