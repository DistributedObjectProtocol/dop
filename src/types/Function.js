import { ESCAPE_KEY, FUNCTION_KEY } from '../const'
import { getUniqueKey } from '../util/get'
import { isInteger, isFunction } from '../util/is'
import { isValidToDecode, isValidToEscape } from '../util/isValid'

export default function Func() {}

Func.encode = function({
    value,
    remote_functions,
    local_functions,
    registerLocalFunctionFromEncode
}) {
    if (isFunction(value)) {
        if (remote_functions.has(value)) return null
        const function_id = local_functions.has(value)
            ? local_functions.get(value)
            : registerLocalFunctionFromEncode(value)
        return { [FUNCTION_KEY]: function_id }
    } else if (isValidToDecode({ value, key: FUNCTION_KEY })) {
        return { [ESCAPE_KEY]: value } // we don't go deeper
    }
    return value
}

Func.decode = function({ value, remote_functions_id, createRemoteFunction }) {
    if (
        getUniqueKey(value) === FUNCTION_KEY &&
        isInteger(value[FUNCTION_KEY])
    ) {
        const function_id = value[FUNCTION_KEY]
        const fn = remote_functions_id[function_id]
        return isFunction(fn) ? fn : createRemoteFunction(function_id)
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: FUNCTION_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}
