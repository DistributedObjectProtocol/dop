dop.core.storeSendMessages = function(node, message, wrapper) {
    dop.core.storeMessage(node, message, wrapper)
    dop.core.sendMessages(node)
}
