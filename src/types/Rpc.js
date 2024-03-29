import { ESCAPE_KEY, RPC_KEY } from '../const.js'
import { getUniqueKey } from '../util/getset.js'
import {
    isInteger,
    isFunction,
    isValidToEscape,
    isValidToDecode,
} from '../util/is.js'

export default function Rpc() {}

Rpc.encode = function ({ value, local_rpcs, registerLocalRpcFromEncode }) {
    if (isFunction(value)) {
        const function_id = local_rpcs.has(value)
            ? local_rpcs.get(value)
            : registerLocalRpcFromEncode(value)
        return { [RPC_KEY]: function_id }
    } else if (isValidToDecode({ value, key: RPC_KEY })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Rpc.decode = function ({
    value,
    createRemoteFunction,
    path,
    caller,
    function_creator,
}) {
    if (getUniqueKey(value) === RPC_KEY && isInteger(value[RPC_KEY])) {
        return createRemoteFunction({
            function_id: value[RPC_KEY],
            function_creator,
            caller,
            path: path.slice(2),
        })
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: RPC_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}
