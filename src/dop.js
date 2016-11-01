(function(root) {

var dop = {
    version: '0.1.0',

    // Where all the internal information is stored
    "data": {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        object_data:{},
        collectors:[],
        collectorsSystem:[],
        lastGet:{}
    },
    
    // src
    "util": {},
    "core": {},
    "protocol": {},
    "transport": {listen:{}, connect:{}}
};


// Special properties assigned to user objects
var CONS = {
    socket_token: '~TOKEN_DOP',
    dop: '~dop'
};
