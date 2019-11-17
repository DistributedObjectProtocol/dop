import forEachObject from './forEachObject'
import createFunction from './createFunction'

// https://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
export default function createCustomMerge(function_name, mutator) {
    return createFunction(function_name, function recursive(destiny, origin) {
        const args = arguments
        if (args.length > 2) {
            // Remove the destiny 2 arguments of the arguments and add thoose arguments as recursived at the begining
            Array.prototype.splice.call(
                args,
                0,
                2,
                recursive.call(this, destiny, origin)
            )
            // Recursion
            return recursive.apply(this, args)
        } else if (origin === destiny) {
            return destiny
        } else {
            forEachObject(origin, mutator, destiny)
            return destiny
        }
    })
}
