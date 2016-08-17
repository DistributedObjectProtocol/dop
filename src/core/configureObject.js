
dop.core.configureObject = (function(){

    var canWeProxy = typeof Proxy == 'function';

    return function( object, path, shallWeProxy ) {

        if (object.hasOwnProperty(dop.specialkey.object_path))
            return object;

        var prop, value;

        for (prop in object) {

            value = object[prop];

            if ( value && value !== object && (value.constructor === Object || (Array.isArray(value))) ) {
                                
                if (value.hasOwnProperty(dop.specialkey.object_path))
                    object[prop] = value = dop.util.merge({},value);

                dop.core.configureObject( value, path.concat(prop), shallWeProxy);
            }

        }

        // Making proxy object
        // if ( canWeProxy && shallWeProxy )
            // object = new Proxy(object, dop.core.proxyHandler);

        // Setting path
        Object.defineProperty( object, dop.specialkey.object_path, {value:path} );

        return object;

    };

})();



