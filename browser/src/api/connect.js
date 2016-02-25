

dop.api.prototype.connect = function( ) {

    this.connector = this[this.options.connector.name_connector] = this.options.connector( this.options, {

        open: dop.on.open.bind(this),

        message: dop.on.message.bind(this),

        close: dop.on.close.bind(this),

        error: dop.on.error.bind(this)

    });

    this.connected = new dop.util.promise(); // Promise fullfiled when the user is connected with the token

    return this.connected;

};