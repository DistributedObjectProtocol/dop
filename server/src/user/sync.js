

synko.user.prototype.sync = function( object_name, object, options ) {

    var user = this,
        instance = this.synko;
        object_name = object_name.trim(),
        object_id;

    // If the user already is subscribed to this object
    if ( typeof user.objects[object_name] == 'object' )
        throw new TypeError( synko.error.SYNC_NO_REPEAT_NAME );

    // Must be an object
    if ( typeof object != 'object' )
        throw new TypeError( synko.error.SYNC_MUST_BE_OBJECT );


    if (typeof options != 'object')
        options = {};

    if (typeof options.writable != 'boolean')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable != 'boolean')
        options.observable = false; // user/client can edit it from the browser



    // If the object doesn't exist yet
    if ( synko.util.typeof( object[synko.key_object_path] ) != 'array' ) {

        object_id = synko.object_inc++;

        synko.configure.call(
            instance,
            object, 
            [object_id]
        );

        synko.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable}; // users is an objects of the users than are subscribed to this object

    }


    // If the object is already registered
    else {

        // Checking if the object is inside into another object already synced
        if ( object[synko.key_object_path].length > 1 )
            throw new TypeError( synko.error.SYNC_NO_INNER );

        // we get the object_id
        var object_id = object[synko.key_object_path][0];

        // Checking if the object is registered correctly on the same instance of synko
        if ( typeof synko.objects[ object_id ] == 'undefined')
            synko.objects[ object_id ] = {object:object, users:{}, subscribed:0, observable:options.observable};
        
    }


    synko.objects[ object_id ].users[ user.token ] = user;
    synko.objects[ object_id ].subscribed += 1;

    user.objects[object_name] = object;
    user.writables[object_id] = options.writable;


    var request = synko.request.call( instance, [
        synko.protocol.sync,
        object_id,
        options.writable*1, // false*1 === 0
        object,
        object_name
    ]);

    user.send( synko.stringify.call(instance, request.data) );
    return request.promise;

};