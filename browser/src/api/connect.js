

synko.api.prototype.connect = function( url, options ) {

    if (synko.util.typeof(options) != 'object')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = synko.ws;


    this.connector = this[options.connector.name_connector] = options.connector( url, options, {

        open: synko.on.open.bind(this),

        message: synko.on.message.bind(this),

        close: synko.on.close.bind(this),

        error: synko.on.error.bind(this)

    });

    this.connected = new synko.util.promise(); // Promise fullfiled when the user is connected with the token

    return this.connected;

};