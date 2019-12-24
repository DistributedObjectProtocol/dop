import { isFunction, isInteger, isArray } from '../util/is'
import createRequest from '../util/createRequest'
import localProcedureCall from '../util/localProcedureCall'
import converter from '../util/converter'
import { NAME_REMOTE_FUNCTION } from '../const'
import { getUniqueKey } from '../util/get'

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
                if (args.length > 0) data.push(args)
                req.data = data
                req.node = api
                req.destroy = () => delete requests[request_id]
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
            // console.log(api.ENV, msg)
            if (api.opened) {
                try {
                    msg = decode(deserialize(msg))
                } catch (e) {
                    // Invalid array to deserialize or decode
                    return false
                }

                let [id, function_id, args] = msg

                if (isInteger(id)) {
                    const f = local_functions_id[function_id]

                    // Request
                    if (id > 0 && isFunction(f)) {
                        const req = createRequest()
                        const response = [-id]
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
                    else if (id < 0 && requests.hasOwnProperty(id * -1)) {
                        const request_id = id * -1
                        const response_status = function_id
                        const req = requests[request_id]
                        response_status === 0
                            ? req.resolve(args)
                            : req.reject(response_status)
                        req.destroy()
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
            const encodeFunction = ({ value }) => {
                if (isFunction(value)) {
                    if (value.name === NAME_REMOTE_FUNCTION) return null
                    const function_id = local_functions_map.has(value)
                        ? local_functions_map.get(value)
                        : registerLocalFunction(value)
                    return { ['$function']: function_id }
                }
                return value
            }
            return converter(object, encoders.concat(encodeFunction))
        }

        function decode(object) {
            const decodeFunction = ({ value }) => {
                if (
                    getUniqueKey(value) === '$function' &&
                    isInteger(value['$function'])
                ) {
                    const function_id = value['$function']
                    const f = remote_functions_id[function_id]
                    return isFunction(f) ? f : createRemoteFunction(function_id)
                }
                return value
            }
            return converter(object, decoders.concat(decodeFunction))
        }

        const api = {
            open,
            message,
            close,
            opened: false
        }

        return api
    }
}
