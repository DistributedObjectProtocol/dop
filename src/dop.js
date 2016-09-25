
var dop = {

    version: '0.1.0',
    name: 'dop',
    
    // special properties
    specialprop: {
        socket_token: '~TOKEN_DOP',
        dop: '~dop'
    },

    data: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        mutations:[],
        collecting:false,
        collectingSystem:false,
        lastGet:{}
    },

    // src
    util:{},
    core:{},
    protocol:{},
    listener:{},
    connector:{},
    transport:{listen:{}, connect:{}}

};