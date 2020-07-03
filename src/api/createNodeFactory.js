import { isFunction, isInteger, isArray } from '../util/is'
import createRequest from '../util/createRequest'
import localProcedureCall from '../util/localProcedureCall'
import { RPC_CREATOR } from '../const'

export default function createNodeFactory({ encode, decode }) {
    return function createNode({
        serialize = JSON.stringify,
        deserialize = JSON.parse,
        rpcFilter = (props) => props.rpc,
        errorInstances = [Error],
    } = {}) {
        const requests = {}
        let request_id_index = 0
        const local_rpcs_id = {}
        const local_rpcs = new Map()
        let local_function_index = 1 // 0 is reserved for the entry function used in open()

        const encode_params = {
            local_rpcs,
            registerLocalRpcFromEncode,
        }

        function registerLocalRpc(function_id, fn) {
            local_rpcs_id[function_id] = fn
            local_rpcs.set(fn, function_id)
            return function_id
        }

        function createRpc(function_id) {
            const makeCall = (request_id, args) => {
                const data = [request_id, function_id]
                if (args.length > 0) data.push(args)
                node.send(encode(data, encode_params))
                return data
            }

            const rpc = (...args) => {
                const request_id = ++request_id_index
                const req = createRequest()
                const { resolve, reject } = req
                const resolveOrReject = (fn, value) => {
                    fn(value)
                    delete requests[request_id]
                    return req
                }
                req.data = makeCall(request_id, args)
                req.node = node
                req.createdAt = new Date().getTime()
                req.resolve = (value) => resolveOrReject(resolve, value)
                req.reject = (error) => resolveOrReject(reject, error)
                requests[request_id] = req
                return req
            }

            rpc.push = (...args) => {
                makeCall(0, args)
            }

            return rpc
        }

        function createRemoteFunction({
            function_id,
            function_creator,
            caller,
            path,
        }) {
            return rpcFilter({
                rpc: createRpc(function_id),
                node,
                function_id,
                function_creator,
                caller,
                path,
            })
        }

        function getNextLocalFunctionId() {
            while (local_rpcs_id.hasOwnProperty(local_function_index)) {
                local_function_index += 1
            }
            return local_function_index
        }

        function open(send, fn) {
            const function_id = 0
            if (isFunction(fn)) registerLocalRpc(function_id, fn)
            node.send = (msg) => send(serialize(msg))
            return createRemoteFunction({
                function_id,
                function_creator: RPC_CREATOR.ENTRY,
            })
        }

        function message(msg) {
            msg = deserialize(msg)
            if (!isArray(msg) || !isInteger(msg[0])) {
                return false
            }

            const [id, function_id] = msg
            const is_request = id > -1
            const fn = is_request ? local_rpcs_id[function_id] : undefined

            msg = decode(msg, {
                createRemoteFunction,
                caller: fn,
                function_creator: is_request
                    ? RPC_CREATOR.REQUEST
                    : RPC_CREATOR.RESPONSE,
            })

            let args = msg[2]
            const response_id = -id

            if (is_request && isFunction(fn)) {
                args = isArray(msg[2]) ? msg[2] : []

                // Request without response
                if (id === 0) {
                    const req = { node }
                    args.push(req)
                    fn.apply(req, args)
                }

                // Request
                else {
                    const req = createRequest()
                    const response = [response_id]
                    req.node = node
                    req.then((value) => {
                        response.push(0) // no errors
                        if (value !== undefined) response.push(value)
                        node.send(encode(response, encode_params))
                    }).catch((error) => {
                        response.push(error === 0 ? null : error)
                        node.send(encode(response, encode_params))
                    })
                    args.push(req)
                    localProcedureCall(fn, req, args, errorInstances)
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

            return false
        }

        function registerLocalRpcFromEncode(fn) {
            return registerLocalRpc(getNextLocalFunctionId(), fn)
        }

        const node = {
            open,
            message,
            requests,
        }

        return node
    }
}
