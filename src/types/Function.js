import { ESCAPE_KEY, FUNCTION_KEY } from '../const'
import { isValidToEscape, isValidToDecode } from '../util/isValid'
import { getUniqueKey } from '../util/get'
import { isInteger, isFunction } from '../util/is'

export default function Function() {}

Function.encode = function ({
    value,
    local_functions,
    registerLocalFunctionFromEncode,
}) {
    if (isFunction(value)) {
        const function_id = local_functions.has(value)
            ? local_functions.get(value)
            : registerLocalFunctionFromEncode(value)
        return { [FUNCTION_KEY]: function_id }
    } else if (isValidToDecode({ value, key: FUNCTION_KEY })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Function.decode = function ({
    value,
    createRemoteFunction,
    path,
    caller,
    function_creator,
}) {
    if (
        getUniqueKey(value) === FUNCTION_KEY &&
        isInteger(value[FUNCTION_KEY])
    ) {
        return createRemoteFunction({
            function_id: value[FUNCTION_KEY],
            function_creator,
            caller,
            path: path.slice(2),
        })
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: FUNCTION_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}
