

syncio.user = function( user_socket, user_id ){

    // Setup new user
    this.token = (user_id).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator
             // (this.user_id++).toString(36) + (Math.random() * Math.pow(10,18)).toString(36)  // http://jsperf.com/token-generator-with-id
             //  Number((this.user_id++) + "" + (Math.random() * Math.pow(10,18))).toString(36)

    this.socket = user_socket;
    this.writables = {};
    this.objects = {};

};


syncio.user.prototype.send = function( message ) {
    return this.socket.send( message );
};

syncio.user.prototype.close = function() {
    return this.socket.close();
};

syncio.user.prototype.writable = function( name, value ) {
    if ( typeof value == 'boolean' ) {
        this.writables[name] = value
    }
    else
        return this.writables[name];
};

