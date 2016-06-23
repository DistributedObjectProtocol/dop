

dop.onsync = function( name, object, options ) {

    if ( dop.util.typeof(dop.object_name[name]) == 'object' )
        throw Error(dop.core.error.api.OBJECT_NAME_REGISTERED);

    dop.object_name[name] = {};

    if ( typeof object == 'function' ) {

    }

    else {

        if ( dop.util.typeof(options) != 'object' )
            options = {writable:false, extendible:false, asyncawait:true};

        dop.object_name[name].options = options;
        dop.object_name[name].callback = false;
        var proxy = dop.core.registerObject( object );
        dop.object_name[name].object_id = proxy[dop.key_object_path][0];
        return proxy;
    }

};




dop.core.registerObject = function( object ) {

    if ( !object.hasOwnProperty(dop.key_object_path) ) {
        // Getting id to store
        var object_id = dop.object_inc++,
        // Setting up the object to listen the sync event
        config = {
            object: object,
            editing: {},
            owner: true,
            writable: true,
            extendible: true,
            nodes: 0,
            node: {}
        };

        var proxy = dop.core.configureObject( object, [object_id] );
        config.proxy = proxy;
        dop.object[object_id] = config;
        return proxy;
    }
    else
        return dop.object[object[dop.key_object_path][0]].proxy;

};



dop.core.configureObject = function( object, path ) {

    // Making proxy object
    var proxy;
    if (dop.core.configureObject.canWeProxy)
        proxy = new Proxy(object, dop.core.proxyHandler);

    // Same than above for nested objects
    dop.util.path( object, function(subpath, value, prop, obj ) {

        var newpath = path.concat(subpath);

        // if ( value === that.options.stringify_function )
        //     obj[prop] = synko.remoteFunction.call( that, newpath );

        if ( dop.util.typeof(value) == 'object' && typeof value[dop.key_object_path] == 'undefined' ) {
        
            if (dop.core.configureObject.canWeProxy)
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
dop.core.configureObject.canWeProxy = typeof Proxy == 'function';





dop.core.proxyHandler = {
    set: function(target, prop, value) {
        console.log('PROXY SET!', target[dop.key_object_path], prop);
        target[prop] = value;
        return true;
    }
};

