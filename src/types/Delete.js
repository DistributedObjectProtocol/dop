export default function factoryDelete() {
    const key = '$delete'

    // Constructor/Creator
    function Delete() {
        if (!(this instanceof Delete)) {
            return new Delete()
        }
    }

    Delete.key = key

    Delete.isValidToStringify = function(value) {
        return value instanceof Delete
    }

    Delete.stringify = function() {
        return { [key]: 0 }
    }

    Delete.isValidToParse = function(value) {
        return value[key] === 0
    }

    Delete.parse = function() {
        return new Delete()
    }

    return Delete
}
