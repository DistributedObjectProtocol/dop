import { is } from './is'
import createCustomMerge from './createCustomMerge'

export default createCustomMerge('merge', ({ origin, destiny, prop, path }) => {
    const tof_origin = is(origin[prop])
    const tof_destiny = is(destiny[prop])
    if (tof_origin == 'object' || tof_origin == 'array') {
        if (!destiny.hasOwnProperty(prop) || tof_origin != tof_destiny) {
            destiny[prop] = tof_origin == 'array' ? [] : {}
        }
    } else {
        destiny[prop] = origin[prop]
    }
})
