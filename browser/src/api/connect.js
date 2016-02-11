

synko.api.prototype.connect = function( ) {

    this.connector = this[this.options.connector.name_connector] = this.options.connector( url, this.options, {

        open: synko.on.open.bind(this),

        message: synko.on.message.bind(this),

        close: synko.on.close.bind(this),

        error: synko.on.error.bind(this)

    });

    this.connected = new synko.util.promise(); // Promise fullfiled when the user is connected with the token

    return this.connected;

};