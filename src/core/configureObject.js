
dop.core.configureObject = (function(){

    var canWeProxy = typeof Proxy == 'function';

    return function( object, path, shallWeProxy ) {

        // Making proxy object
        var proxy;
        if ( canWeProxy && shallWeProxy )
            proxy = new Proxy(object, dop.core.proxyHandler);

        // Same than above for nested objects
        dop.util.path( object, function(subpath, value, prop, obj ) {

            var newpath = path.concat(subpath);

            // if ( value === that.options.stringify_function )
            //     obj[prop] = synko.remoteFunction.call( that, newpath );

            if ( dop.util.typeof(value) == 'object' && typeof value[dop.key_object_path] == 'undefined' ) {
            
                if ( canWeProxy && shallWeProxy )
                    Object.defineProperty(
                        dop.util.get(proxy, subpath.slice(0,subpath.length-1)),
                        prop,
                        {value:new Proxy(value, dop.core.proxyHandler), enumerable:true,writable:true}
                    );

                // Setting path
                Object.defineProperty( value, dop.key_object_path, {value: newpath} );

            }

        });

        // Setting path
        Object.defineProperty( object, dop.key_object_path, {value: path} );

        return proxy || object;

    };

})();



