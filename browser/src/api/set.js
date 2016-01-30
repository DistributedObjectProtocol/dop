

synko.api.prototype.set = function( object, key, value ) {

    // If writable

    
    if ( synko.util.typeof( object[synko.key_object_path] ) != 'array' ) {
        // error
    }

    var old_value = object[key],
        path = object[synko.key_object_path].slice(0),
        data = [ synko.protocol.set, path, old_value ];
        path.push( key );
    

    if ( arguments.length == 3)
        data.push( value );

    var request = synko.request.call( this, data );
    this.send( synko.stringify.call(this, request.data ) );

    return request.promise;

};












