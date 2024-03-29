import { ESCAPE_KEY, SWAP_KEY } from '../const.js'
import { isArray, isValidToEscape } from '../util/is.js'
import { getUniqueKey } from '../util/getset.js'

export default function Swap(...args) {
    if (!(this instanceof Swap)) {
        return new Swap(...args)
    }
    this.args = args
}

Swap.patch = function ({ patch, target, prop, old_value }) {
    const patch_value = patch[prop]
    if (patch_value instanceof Swap) {
        target[prop] = old_value
        if (isArray(old_value)) {
            const array = old_value
            const swaps = patch_value.args
            if (array.length > 0 && swaps.length > 1) {
                const total = swaps.length - 1
                for (let index = 0; index < total; index += 2) {
                    const swap_a = swaps[index]
                    const swap_b = swaps[index + 1]
                    const temp_item = array[swap_a]
                    array[swap_a] = array[swap_b]
                    array[swap_b] = temp_item
                }
                return Swap.apply(null, swaps.slice(0).reverse())
            }
        }
    }
    return old_value
}

Swap.encode = function ({ value }) {
    if (value instanceof Swap) {
        return { [SWAP_KEY]: value.args }
    } else if (isValidToDecode({ value, key: SWAP_KEY })) {
        return { [ESCAPE_KEY]: value }
    }
    return value
}

Swap.decode = function ({ value }) {
    if (isValidToDecode({ value, key: SWAP_KEY })) {
        return Swap.apply(null, value[SWAP_KEY])
    } else if (
        isValidToEscape({ value }) &&
        isValidToDecode({ value: value[ESCAPE_KEY], key: SWAP_KEY })
    ) {
        return value[ESCAPE_KEY]
    }
    return value
}

function isValidToDecode({ value }) {
    return getUniqueKey(value) === SWAP_KEY && isArray(value[SWAP_KEY])
}
