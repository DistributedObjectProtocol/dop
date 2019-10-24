import { is } from './is'
import createCustomMerge from './createCustomMerge'

const merge = createCustomMerge(({ origin, destiny, prop }) => {
    const tof_origin = is(origin[prop])
    const tof_destiny = is(destiny[prop])
    if (tof_origin == 'object' || tof_origin == 'array') {
        !destiny.hasOwnProperty(prop)
            ? (destiny[prop] = tof_origin == 'array' ? [] : {})
            : destiny[prop]
    } else {
        destiny[prop] = origin[prop]
    }
})

export default merge
