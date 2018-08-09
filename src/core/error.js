dop.core.error = {
    // warning: {
    //     TOKEN_REJECTED: 'User disconnected because is rejecting too many times the token assigned'
    // },

    reject_local: {
        OBJECT_NOT_FOUND: 'Object not found',
        NODE_NOT_FOUND: 'Node not found',
        TIMEOUT_REQUEST: 'Timeout waiting for response'
    },

    // Remote rejects
    reject_remote: {
        OBJECT_NOT_FOUND: 1,
        1: 'Remote object not found or not permissions to use it',
        SUBSCRIPTION_NOT_FOUND: 2,
        2: 'Subscription not found to unsubscribe this object',
        FUNCTION_NOT_FOUND: 3,
        3: 'Remote function not found to be called',
        CUSTOM_REJECTION: 4
        // 4: ''
    }
}
