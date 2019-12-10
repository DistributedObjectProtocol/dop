import { getUniqueKey } from '../util/get'

export default function factoryDelete({ types }) {
    const key = '$delete'

    // Constructor/Creator
    function Delete() {
        if (!(this instanceof Delete)) {
            return new Delete()
        }
    }

    // Mandatory
    Delete.key = key

    // Mandatory
    Delete.isValidToStringify = function(value) {
        return value instanceof Delete
    }

    // Mandatory
    Delete.stringify = function() {
        return { [key]: 1 }
    }

    // Mandatory
    Delete.isValidToParse = function(value) {
        const unique_key = getUniqueKey(value, types)
        return unique_key === key && value[key] === 1
    }

    // Mandatory
    Delete.parse = function(value) {
        return new Delete()
    }

    // Optionals
    Delete.isValidToPatch = function(value, prop, destiny) {
        return value instanceof Delete || !destiny.hasOwnProperty(prop)
    }

    Delete.patch = function(value, prop, destiny) {
        const oldValue = !destiny.hasOwnProperty(prop)
            ? new Delete()
            : destiny[prop]

        if (value instanceof Delete) {
            delete destiny[prop]
        } else {
            destiny[prop] = value
        }
        return oldValue
    }

    // Delete.beforeStringify = ()=>{}
    // Delete.afterStringify = ()=>{}
    // Delete.beforeParse = ()=>{}
    // Delete.afterParse = ()=>{}

    return Delete
}
