
dop.core.listener = function(args) {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    args.unshift(dop, this);
    this.options = args[2];
    this.transport = this.options.transport.apply(this, args);
};
// Inherit emitter
dop.util.merge(dop.core.listener.prototype, dop.util.emitter.prototype);
