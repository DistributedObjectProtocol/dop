
dop.core.listener = function(options) {
    // Inherit emitter
    Object.assign(this, dop.util.emitter.prototype);
    this.options = options;
    this.transport = options.transport(options, dop, this);
};