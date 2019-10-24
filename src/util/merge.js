import { is, isPojoObject } from './is'
import createCustomMerge from './createCustomMerge'

export default createCustomMerge('merge', ({ origin, destiny, prop, path }) => {
    const origin_value = origin[prop]
    const tof_origin = is(origin_value)
    const tof_destiny = is(destiny[prop])
    if (isPojoObject(origin_value)) {
        if (!destiny.hasOwnProperty(prop) || tof_origin != tof_destiny) {
            destiny[prop] = tof_origin == 'array' ? [] : {}
        }
    } else {
        destiny[prop] = origin_value
        return true // skiping
    }
})
