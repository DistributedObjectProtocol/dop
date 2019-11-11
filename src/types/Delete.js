export default function factoryDelete() {
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
    Delete.stringify = function(value) {
        return value instanceof Delete ? { [key]: 1 } : value
    }

    // Mandatory
    Delete.parse = function(value) {
        return value[key] === 1 ? new Delete() : value
    }

    // Optionals
    // Delete.beforeStringify = ()=>{}
    // Delete.afterStringify = ()=>{}
    // Delete.beforeParse = ()=>{}
    // Delete.afterParse = ()=>{}

    return Delete
}
