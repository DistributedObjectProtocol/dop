
// Useful to create remote functions before the sync, when the object synced is not writable: myobject = {remotefun: myserver.remoteFunction()};
synko.api.prototype.remoteFunction = function() {
    return this.options.stringify_function;
};