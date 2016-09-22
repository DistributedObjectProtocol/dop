
dop.core.mutate = function(target, property, value) {

    var isSet = (arguments.length > 2), // is set or delete mutation
        hasOwnProperty = target.hasOwnProperty(property),
        oldValue = target[property],
        proxy=target,
        object_dop;

    if ( (isSet && oldValue !== value) || (!isSet && hasOwnProperty) ) {

        if (dop.isRegistered(target)) {
            object_dop = dop.getObjectDop(target);
            proxy = object_dop.p;
            target = object_dop.t;
        }
        
        // Setting
        if (isSet) {
            target[property] = value;
            if ( dop.isObject(value) ) {
                var isRegistered = dop.isRegistered(value);
                if ( !isRegistered || (isRegistered && dop.getObjectDop(value)._ !== proxy) ) {
                    var shallWeProxy = (isRegistered) ? dop.data.object[dop.getObjectId(value)].options.proxy : true;
                    target[property] = dop.core.configureObject( value, object_dop.concat(property), shallWeProxy);
                }
            }
        }
        // Deleting
        else
            delete target[property];

        var mutation = {property:property, object:proxy};
        if (isSet)
            mutation.value = value;
        if (hasOwnProperty)
            mutation.oldValue = oldValue;

        return mutation;
    }

    return false;
};