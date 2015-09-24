

syncio.user.prototype.writable = function( name, value ) {

    if ( typeof value == 'boolean' )
        this.writables[name] = value

    else
        return this.writables[name];

};