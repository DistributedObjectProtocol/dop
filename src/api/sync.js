

syncio.api.prototype.sync = function( name, options ) {

    if (typeof options != 'object')
        options = {};

    if (options.object == null || (typeof options.object != 'object' && typeof options.object != 'function'))
        throw new TypeError( syncio.error.SYNC_MUST_BE_OBJECT );

    if (typeof options.writable == 'undefined')
        options.writable = false; // user/client can edit it from the browser

    if (typeof options.observable == 'undefined')
        options.observable = (typeof Object.observe == 'function'); // observe changes with Object.observe

    this.objects_original[name] = options;

};