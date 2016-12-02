(function factory(root) {

var dop = {
    version: '0.3.2',
    name: 'dop', // Useful for transport (websockets namespaces)
    create: factory,

    // Where all the internal information is stored
    data: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        object_data:{},
        collectors:[[],[]],
        lastGet:{}
    },
    
    // src
    util: {},
    core: {},
    protocol: {},
    transports: {listen:{}, connect:{}},

    CONS: {
        CLOSE: 0,
        OPEN: 1,
        CONNECT: 2,
        RECONNECT: 3
    }
    
};


// Special properties assigned to user objects
var CONS = {
    socket_token: '~TOKEN_DOP',
    dop: '~dop'
};
