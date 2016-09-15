
dop.core.configureObject = (function() {

    var canWeProxy = typeof Proxy == 'function';

    return function( object, path, shallWeProxy, parent ) {

        // Creating a copy if is another object registered
        if (dop.isRegistered(object))
            return dop.core.configureObject( dop.util.merge({},object), path, shallWeProxy, parent);

        // Recursion
        var property, value;
        for (property in object) {
            value = object[property];
            if ( value && value !== object && (value.constructor === Object || (Array.isArray(value))) )
                object[property] = dop.core.configureObject(value, path.concat(property), shallWeProxy, object);
        }

        // Setting path
        Object.defineProperty( object, dop.specialprop.dop, {value:path.slice(0)} );

        // // Parent object
        // if (path.length > 1 && dop.isObject(parent))
            // dop.getObjectDop(object).p = parent;

        // Making proxy object
        if ( shallWeProxy && canWeProxy ) {
            // Adding traps for mutations methods of arrays
            if ( dop.util.typeof( object ) == 'array' )
                Object.defineProperties(object, dop.core.proxyArrayHandler);
            object = new Proxy(object, dop.core.proxyObjectHandler);
        }

        return object;

    };

})();