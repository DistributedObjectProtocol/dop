
dop.core.set = function(target, property, value) {

    var oldValue = target[property],
        proxy=target,
        object_dop;

    if (oldValue !== value) {

        if (dop.isRegistered(target)) {
            object_dop = dop.getObjectDop(target);
            proxy = object_dop.p;
            target = object_dop.t;
        }
        
        target[property] = value;

        if ( dop.isObject(value) ) {
            var isRegistered = dop.isRegistered(value);
            if ( !isRegistered || (isRegistered && dop.getObjectDop(value)._ !== proxy) ) {
                var shallWeProxy = (isRegistered) ? dop.data.object[dop.getObjectId(value)].options.proxy : true;
                target[property] = dop.core.configureObject( value, object_dop.concat(property), shallWeProxy);
            }
        }

        var mutation = {property:property, value:value, object:proxy};
        if (target.hasOwnProperty(property))
            mutation.oldValue = oldValue;

        return mutation;
    }

    return false;
};