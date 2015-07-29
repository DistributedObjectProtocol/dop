

syncio.create.prototype.sync = function( name, options ) {

    if (typeof options != 'object')
        options = {};

    if (options.object == null || (typeof options.object != 'object' && typeof options.object != 'function'))
        options.object = {}; // create a copy/clone for any user that subscribe this object

    if (typeof options.writable == 'undefined')
        options.writable = false; // user can edit it from the browser

    if (typeof options.observable == 'undefined')
        options.observable = (typeof Object.observe == 'function'); // observe changes with Object.observe

    this.objects_original[name] = options;

};