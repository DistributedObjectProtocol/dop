
dop.core.configureObject = (function(){

    var canWeProxy = typeof Proxy == 'function';

    return function( object, path, shallWeProxy ) {

        // Making proxy object
        var proxy, shallWeDefinePath = !object.hasOwnProperty(dop.specialkey.object_path);
        if ( canWeProxy && shallWeProxy )
            proxy = new Proxy(object, dop.core.proxyHandler);

        if ( shallWeDefinePath && canWeProxy && shallWeProxy ) {
            // Same than above for nested objects
            dop.util.path( object, function(subpath, value, prop, obj ) {

                var newpath = path.concat(subpath);

                if ( dop.util.typeof(value) == 'object' && typeof value[dop.specialkey.object_path] == 'undefined' ) {

                    // if ( canWeProxy && shallWeProxy ){
                    //     var object_deep = dop.util.get(proxy, subpath.slice(0,subpath.length-1));
                    //     console.log(canWeProxy, shallWeProxy, object_deep instanceof Proxy )
                    //     object_deep[prop] = new Proxy(value, dop.core.proxyHandler);
                    // }

                    // Setting path
                    if ( shallWeDefinePath )
                        Object.defineProperty( value, dop.specialkey.object_path, {value:newpath} );
                }

            });
        }

        // Setting path
        if ( shallWeDefinePath )
            Object.defineProperty( object, dop.specialkey.object_path, {value:path} );

        return proxy || object;

    };

})();



