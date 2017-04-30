
var canWeProxy = typeof Proxy == 'function';
dop.core.configureObject = function(object, propertyParent, parent) {

    // Creating a copy if is another object registered
    if (dop.isRegistered(object))
        return dop.core.configureObject(
            dop.util.clone(object),
            propertyParent,
            parent
        );

    // // Removing fake dop property
    // delete object[dop.cons.DOP];


    // Setting ~DOP object
    var object_dop = {};
    object_dop.r = parent === undefined ? object : dop.getObjectRoot(parent); // root
    object_dop._ = parent; // parent
    object_dop.pr = propertyParent; // property
    object_dop.o = []; // observers
    object_dop.op = {}; // observers property
    object_dop.om = {}; // observers multiple
    object_dop.omp = {}; // observers multiple property
    object_dop.m = []; // temporal mutations before will be emitted
    Object.defineProperty(object, dop.cons.DOP, {value:object_dop});


    // Deep objects (Recursion)
    var property, value, object_dop, is_array=isArray(object);
    for (property in object) {
        if (is_array)
            property = Number(property);
        value = object[property];
        if (isFunction(value) && value.name==dop.core.createRemoteFunction.name) {
            throw Error('TODOOOOO')
            object[property] = value(path[0], path.slice(1).concat(property));
        }
        else if (dop.isObjectRegistrable(value))
            object[property] = dop.core.configureObject(value, property, object);
    }


    // if (isObject(parent))
        // object_dop._ = (dop.isRegistered(parent)) ? dop.getObjectTarget(parent) : parent;


    // Making proxy object
    if (canWeProxy) {
        var target = object;
        object = new Proxy(object, dop.core.proxyObjectHandler);
        // Adding proxy and target alias
        object_dop.p = object;
        object_dop.t = target;
    }
    else
        object_dop.p = object_dop.t = object;


    // Adding traps for mutations methods of arrays
    if (dop.util.typeof(object) == 'array')
        Object.defineProperties(object, dop.core.proxyArrayHandler);


    return object;
};