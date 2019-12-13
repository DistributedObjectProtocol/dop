import { isFunction, isInteger, is, isArray } from '../util/is'
import createRequest from '../util/createRequest'
import localProcedureCall from '../util/localProcedureCall'

export default function createNodeFactory(DJSON) {
    const Func = DJSON.Function
    const stringify = DJSON.stringify
    const parse = DJSON.parse
    const name_remote_function = '$dopRemoteFunction'

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
            function f(...args) {
                const request_id = ++request_id_index
                const data = [request_id, function_id]
                const req = createRequest()
                if (args.length > 0) data.push(args)
                req.data = data
                req.node = api
                req.destroy = () => delete requests[request_id]
                requests[request_id] = req
                api.send(stringify(data, stringifyReplacer))
                return req
            }
            Object.defineProperty(f, 'name', {
                value: name_remote_function,
                writable: false
            })
            remote_functions_id[function_id] = f
            return f
        }

        function open(send, f) {
            const remote_function_id = remote_function_index++
            api.send = send
            api.opened = true
            registerLocalFunction(f)
            return createRemoteFunction(remote_function_id)
        }

        function message(msg) {
            // console.log(api.ENV, msg)
            const tof = is(msg)
            if (
                api.opened &&
                ((tof == 'string' && msg[0] === '[') || tof == 'array')
            ) {
                try {
                    msg = tof == 'array' ? msg : parse(msg, parseReplacer)
                } catch (e) {
                    // Not valid array to parse
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
                            api.send(stringify(response, stringifyReplacer))
                        }).catch(error => {
                            response.push(error) // error
                            api.send(stringify(response, stringifyReplacer))
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

        function stringifyReplacer(key, f) {
            // if (Func.isValidToStringify(f) && f.name !== name_remote_function) {
            if (Func.isValidToStringify(f) && f.name !== name_remote_function) {
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
            close,
            opened: false
        }

        return api
    }
}
