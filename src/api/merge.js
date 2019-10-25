import { is, isPojoObject } from '../util/is'
import createCustomMerge from '../util/createCustomMerge'

// https://jsperf.com/merge-challenge
export default createCustomMerge('merge', ({ origin, destiny, prop }) => {
    const origin_value = origin[prop]
    const destiny_value = destiny[prop]
    const tof_origin = is(origin_value)
    const tof_destiny = is(destiny_value)
    if (isPojoObject(origin_value)) {
        if (!destiny.hasOwnProperty(prop) || tof_origin != tof_destiny) {
            // destiny[prop] = tof_origin == 'array' ? [] : {}
            if (tof_origin == 'array') {
                const array = []
                if (tof_destiny == 'object') {
                    Object.keys(destiny_value)
                        .filter(key => !isNaN(Number(key)))
                        .forEach(key => (array[key] = destiny_value[key]))
                }
                destiny[prop] = array
            } else {
                destiny[prop] = {}
            }
        }
    } else if (tof_origin == 'undefined' && destiny.hasOwnProperty(prop)) {
        // skipping
    } else {
        destiny[prop] = origin_value
        return true // skipping
    }
})
