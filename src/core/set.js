dop.core.set = function(object, property, value) {

    var hasOwnProperty = object.hasOwnProperty(property),
        oldValue = object[property];

    if (oldValue !== value) {

        object[property] = value;

        if (dop.isObject(value))
            object[property] = dop.core.configureObject( value, dop.getObjectDop(object).concat(property), true);

        var mutation = {property:property, value:value, object:dop.getObjectDop(object).p};
        if (hasOwnProperty)
            mutation.oldValue = oldValue;

        return mutation;
    }

    return false;
};