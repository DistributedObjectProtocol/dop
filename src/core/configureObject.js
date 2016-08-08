
dop.core.configureObject = (function(){

    var canWeProxy = typeof Proxy == 'function';

    return function( object, path, shallWeProxy ) {

        var proxy, shallWeDefinePath = !object.hasOwnProperty(dop.specialkey.object_path);

        // // Making proxy object
        // if ( canWeProxy && shallWeProxy )
            // proxy = new Proxy(object, dop.core.proxyHandler);

        if ( shallWeDefinePath ) {
            // Same than above for nested objects
            dop.util.path( object, function( subpath, obj ) {

                var newpath = path.concat(subpath),
                    value = obj[subpath[subpath.length-1]];

                if ( dop.util.typeof(value) == 'object' && shallWeDefinePath ) {

                    // // Making proxy object
                    // if ( canWeProxy && shallWeProxy ){
                    //     var object_deep = dop.util.get(proxy, subpath.slice(0,subpath.length-1));
                    //     console.log(canWeProxy, shallWeProxy, object_deep instanceof Proxy )
                    //     object_deep[prop] = new Proxy(value, dop.core.proxyHandler);
                    // }

                    // Setting path
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



