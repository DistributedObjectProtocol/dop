

syncio.create.prototype.sync = function( name, object, options ) {

    if (typeof options != 'object')
        options = {};

    if (typeof options.unique == 'undefined')
        options.unique = false; // create a copy/clone for any user that subscribe this object

    if (typeof options.writable == 'undefined')
        options.writable = false; // user can edit it from the browser

    if (typeof options.observable == 'undefined')
        options.observable = (typeof Object.observe == 'function'); // observe changes with Object.observe


    this.object_original[name] = {object:object, options:options, ids:[]};

};