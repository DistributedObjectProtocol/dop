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
        object: {},

        collectors: [],

        gets_collecting: false,
        gets_paths: [],

        computed_inc: 0,
        computed: {},

        observers_inc: 0,
        observers: {},

        path: {
            // "1.thepath.value": {
                // observers: {},
                // observers_prop: {},
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
        TOKEN: '~TOKEN_DOP',
        DOP: '~DOP',
        // CONNECT: '~CONNECT',
        SEND: '~SEND',
        DISCONNECT: '~DISCONNECT',
        REMOTE_FUNCTION: '$DOP_REMOTE_FUNCTION',
        REMOTE_FUNCTION_UNSETUP: '$DOP_REMOTE_FUNCTION_UNSETUP',
        BROADCAST_FUNCTION: '$DOP_BROADCAST_FUNCTION',
        COMPUTED_FUNCTION: '$DOP_COMPUTED_FUNCTION',
    }

}; 