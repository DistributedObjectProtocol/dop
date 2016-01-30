

syncio.api.prototype.connect = function( url, options ) {

    if (syncio.util.typeof(options) != 'object')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = syncio.ws;


    this.connector = this[options.connector.name_connector] = options.connector( url, options, {

        open: syncio.on.open.bind(this),

        message: syncio.on.message.bind(this),

        close: syncio.on.close.bind(this),

        error: syncio.on.error.bind(this)

    });

    this.connected = new syncio.util.promise(); // Promise fullfiled when the user is connected with the token

    return this.connected;

};