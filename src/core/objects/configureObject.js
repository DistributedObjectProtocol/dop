var can_we_proxy = typeof Proxy == 'function'
dop.core.configureObject = function(object, property_parent, parent) {
    // Creating a copy if is another object registered
    if (dop.isRegistered(object))
        return dop.core.configureObject(
            dop.util.clone(object),
            property_parent,
            parent
        )

    // // Removing fake dop property
    // delete object[dop.cons.DOP];

    // Setting ~DOP object
    var object_dop = {},
        object_proxy,
        object_target
    object_dop._ = parent // parent
    object_dop.pr = isArray(parent) ? Number(property_parent) : property_parent // property

    // Making proxy object
    if (can_we_proxy) {
        object_proxy = object_dop.p = new Proxy(
            object,
            dop.core.proxyObjectHandler
        )
        object_target = object_dop.t = object
    } else object_proxy = object_target = object_dop.p = object_dop.t = object

    // root
    object_dop.r =
        parent === undefined ? object_proxy : dop.getObjectDop(parent).r

    // // Object parent level and more
    // if (parent === undefined) {
    //     object_dop.r = object_proxy;  // root
    //     object_dop.l = 1; // deep level [1,"prop","arr"] this is level 3
    //     object_dop.ia = false; // is inside of array
    // }
    // else {
    //     var object_dop_parent = dop.getObjectDop(parent);
    //     object_dop.l = object_dop_parent.l+1;  // deep level [1,"prop","arr"] this is level 3
    //     object_dop.ia = (object_dop_parent.ia || isArray(parent)); // is inside of array
    // }

    Object.defineProperty(object_target, dop.cons.DOP, {
        value: object_dop,
        enumerable: false,
        configurable: false,
        writable: false
    })

    // Deep objects (Recursion)
    var property,
        value,
        path,
        is_array = isArray(object_target),
        is_function

    for (property in object_target) {
        if (is_array) property = Number(property)
        value = object_target[property]
        is_function = isFunction(value)
        // remote function
        if (is_function && value._name == dop.cons.REMOTE_FUNCTION_UNSETUP) {
            path = dop.getObjectPath(object)
            object_target[property] = value(
                path[0],
                path.slice(1).concat(property)
            )
        }
        // storing computed value function
        else if (is_function && value._name == dop.cons.COMPUTED_FUNCTION)
            object_target[property] = value(
                object_proxy,
                property,
                false,
                undefined
            )
        // object or array
        else if (dop.isPojoObject(value))
            object_target[property] = dop.core.configureObject(
                value,
                property,
                object_proxy
            )
    }

    // if (isObject(parent))
    // object_dop._ = (dop.isRegistered(parent)) ? dop.getObjectTarget(parent) : parent;

    // Adding traps for mutations methods of arrays
    if (dop.util.typeof(object_target) == 'array')
        Object.defineProperties(object_target, dop.core.proxyArrayHandler)

    return object_proxy
}
