
// Useful to create remote functions before the sync: myobject = {remotefun: myserver.remote()};
syncio.api.prototype.remote = function() {
    return this.stringify_function;
};