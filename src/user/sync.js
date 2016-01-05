

syncio.user.prototype.sync = function( object_name, object, options ) {

    var user = this,
        instance = this.syncio;
        object_name = object_name.trim();

    // If the user already is subscribed to this object
    if ( typeof user.objects[object_name] == 'object' )
        throw new TypeError( syncio.error.SYNC_NO_REPEAT_NAME );

    // Must be an object
    if ( typeof object != 'object' )
        throw new TypeError( syncio.error.SYNC_MUST_BE_OBJECT );


    if (typeof options != 'object')
        options = {};

    if (typeof options.writable != 'boolean')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable != 'boolean')
        options.observable = false; // user/client can edit it from the browser



    // If the object doesn't exist yet
    if ( syncio.typeof( object[syncio.key_object_path] ) != 'array' ) {

        var object_id = syncio.object_inc++,
            path = [object_id];

        syncio.configure.call(
            instance,
            object, 
            path
        );

        syncio.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable}; // users is an objects of the users than are subscribed to this object

    }


    // If the object is already registered
    else {

        // Checking if the object is inside into another object already synced
        if ( object[syncio.key_object_path].length > 1 )
            throw new TypeError( syncio.error.SYNC_NO_INNER );

        // we get the object_id
        var object_id = object[syncio.key_object_path][0];

        // Checking if the object is registered correctly on the same instance of syncio
        if ( typeof syncio.objects[ object_id ] == 'undefined')
            syncio.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable};
        
    }


    syncio.objects[ object_id ].users[ user.token ] = user;
    syncio.objects[ object_id ].subscribed += 1;

    user.objects[object_name] = object;
    user.writables[object_name] = options.writable;


    var request = syncio.request.call( instance, [
        syncio.protocol.sync,
        object_id,
        options.writable*1, // false*1 === 0
        object,
        object_name
    ]);

    user.send( syncio.stringify.call(instance, request.data) );
    return request.promise;

};