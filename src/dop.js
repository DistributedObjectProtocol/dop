(function factory(root) {

var dop = {
    name: 'dop',
    create: factory,

    // Internal data
    data: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        collectors:[[],[]],
        observers:{},
        observers_inc:0
    },
    
    // src
    util: {},
    core: {},
    protocol: {},
    transports: {listen:{}, connect:{}},

    // Constants
    cons: {
        TOKEN: '~TOKEN_DOP',
        DOP: '~DOP',
        // CONNECT: '~CONNECT',
        SEND: '~SEND',
        DISCONNECT: '~DISCONNECT',
        REMOTE_FUNCTION: '$DOP_REMOTE_FUNCTION',
        BROADCAST_FUNCTION: '$DOP_BROADCAST_FUNCTION',
    }

};