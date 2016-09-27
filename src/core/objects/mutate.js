
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
        if ( isSet ) {
            target[property] = value;
            if ( dop.isObject(value) ) {
                var isRegistered = dop.isRegistered(value),
                    object_dop_value = dop.getObjectDop(value);
                if ( !isRegistered ) {
                    var shallWeProxy = (isRegistered) ? dop.data.object[dop.getObjectId(value)].options.proxy : true;
                    target[property] = dop.core.configureObject( value, object_dop.concat(property), shallWeProxy);
                }
                else if ( isRegistered && object_dop_value._ === target )
                    object_dop_value[object_dop_value.length-1] = property;


            }
        }
        // Deleting
        else
            delete target[property];

        var mutation = {name:property, object:proxy};
        if (isSet)
            mutation.value = value;
        if (hasOwnProperty)
            mutation.oldValue = oldValue;

        return mutation;
    }

    return false;
};