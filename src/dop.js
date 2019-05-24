(function factory(root) {

var dop = {
    name: 'dop',
    version: '{{VERSION}}',
    create: factory,

    // Internal data
    data: {
        node_inc: 0,
        node: {},

        object_inc: 1,
        // object: {},

        collectors: [],

        gets_collecting: false,
        gets_paths: [],

        computed_inc: 0,
        computed: {},

        observers_inc: 0,
        observers: {},

        path: {
            // "1.thepath.value": {
                // observers_object: {},
                // observers_prop: {},
                // observers_all: {},
                // interceptors: {},
                // interceptors_prop: {},
                // computeds: [],
                // derivations: [],
            // }
        }
    },
    
    // src
    util: {},
    core: {},
    protocol: {},
    transports: {listen:{}, connect:{}},

    // Constants
    cons: {
        DOP: '~DOP',
        TOKEN_LENGTH: 32,        
        REMOTE_FUNCTION: '$DOP_REMOTE_FUNCTION',
        REMOTE_FUNCTION_UNSETUP: '$DOP_REMOTE_FUNCTION_UNSETUP',
        BROADCAST_FUNCTION: '$DOP_BROADCAST_FUNCTION',
        COMPUTED_FUNCTION: '$DOP_COMPUTED_FUNCTION',

        // NODE_STATUS_CONNECTED: 'CONNECTED', // CONNECTED
        // NODE_STATUS_DISCONNECTED: 'DISCONNECTED', // DISCONNECTED, can't be reconnected

        ON_CONNECT: 'connect',
        ON_MESSAGE: 'message',
        ON_DISCONNECT: 'disconnect',
    }

}; 