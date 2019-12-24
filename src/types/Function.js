import { getUniqueKey } from '../util/get'
import { isInteger, isFunction } from '../util/is'
import { FUNCTION_KEY, ESCAPE_KEY } from '../const'

const Func = {}

Func.encode = function({ value, origin, destiny, prop }) {}

Func.decode = function({ value, origin, destiny, prop }) {}

function isValidToDecode({ value }) {}

function isValidToEscape({ value }) {}

export default Func
