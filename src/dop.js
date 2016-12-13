(function factory(root) {

var dop = {
    name: 'dop',
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
        CLOSE: '~CLOSE',
        OPEN: '~OPEN',
        CONNECTING: '~CONNECTING',
        CONNECT: '~CONNECT',
        RECONNECT: '~RECONNECT',
        SEND: '~SEND'
    }
    
};


// Special properties assigned to user objects
var CONS = {
    socket_token: '~TOKEN_DOP',
    dop: '~dop'
};
