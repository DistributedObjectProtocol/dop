

dop.user.prototype.sync = function( object_name, object, options ) {

    var user = this,
        instance = this.dop;
        object_name = object_name.trim(),
        object_id;

    // If the user already is subscribed to this object
    if ( typeof user.objects[object_name] == 'object' )
        throw new TypeError( dop.error.SYNC_NO_REPEAT_NAME );

    // Must be an object
    if ( typeof object != 'object' )
        throw new TypeError( dop.error.SYNC_MUST_BE_OBJECT );


    if (typeof options != 'object')
        options = {};

    if (typeof options.writable != 'boolean')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable != 'boolean')
        options.observable = false; // user/client can edit it from the browser



    // If the object doesn't exist yet
    if ( dop.util.typeof( object[dop.key_object_path] ) != 'array' ) {

        object_id = dop.object_inc++;

        dop.configure.call(
            instance,
            object, 
            [object_id]
        );

        dop.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable}; // users is an objects of the users than are subscribed to this object

    }


    // If the object is already registered
    else {

        // Checking if the object is inside into another object already synced
        if ( object[dop.key_object_path].length > 1 )
            throw new TypeError( dop.error.SYNC_NO_INNER );

        // we get the object_id
        var object_id = object[dop.key_object_path][0];

        // Checking if the object is registered correctly on the same instance of dop
        if ( typeof dop.objects[ object_id ] == 'undefined')
            dop.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable};
        
    }


    dop.objects[ object_id ].users[ user.token ] = user;
    dop.objects[ object_id ].subscribed += 1;

    user.objects[object_name] = object;
    user.writables[object_id] = options.writable;


    var request = dop.request.call( instance, [
        dop.protocol.sync,
        object_id,
        options.writable*1, // false*1 === 0
        object,
        object_name
    ]);

    user.send( dop.stringify.call(instance, request.data) );
    return request.promise;

};