export default function factoryDelete({ types, getUniqueKey }) {
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
    Delete.stringify = function(value) {
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
    // Delete.beforeStringify = ()=>{}
    // Delete.afterStringify = ()=>{}
    // Delete.beforeParse = ()=>{}
    // Delete.afterParse = ()=>{}

    return Delete
}
