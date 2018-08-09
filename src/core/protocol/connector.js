dop.core.connector = function(args) {
    var node = new dop.core.node()
    args.unshift(dop, node)
    node.options = args[2]
    node.transport = node.options.transport
    node.options.transport.apply(this, args)
    return node
}
