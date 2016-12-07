
dop.core.listener = function(args) {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter);
    args.unshift(dop, this);
    this.options = args[2];
    this.transport = this.options.transport;
    this.listener = this.options.transport.apply(this, args);
};