
dop.core.listener = function(options) {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    this.options = options;
    this.transport = options.transport(options, dop, this);
};
// Inherit emitter
Object.assign(dop.core.listener.prototype, dop.util.emitter.prototype);
