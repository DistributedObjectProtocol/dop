import { getUniqueKey } from '../util/get'
import { isInteger } from '../util/is'

export default function factoryFunction({ types }) {
    const key = '$function'

    // Constructor/Creator
    function Func() {}

    // Mandatory
    Func.key = key

    // Mandatory
    Func.isValidToStringify = function(value) {
        return typeof value == 'function'
    }

    // Mandatory
    Func.stringify = function(value) {
        // We ignore this because will be replaced on createNode
        return value
    }

    // Mandatory
    Func.isValidToParse = function(value) {
        const unique_key = getUniqueKey(value, types)
        return unique_key === key && isInteger(value[key])
    }

    // Mandatory
    Func.parse = function(value) {
        // We ignore this because will be replaced on createNode
        return value
    }

    Func.stringifyReplacer = function(function_id) {
        return { [key]: function_id }
    }

    return Func
}
