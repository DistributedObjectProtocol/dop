
// Useful to create remote functions before the sync: myobject = {remotefun: myserver.remote()};
synko.api.prototype.remote = function() {
    return this.options.stringify_function;
};