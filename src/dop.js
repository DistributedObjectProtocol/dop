
var dop = {

    version: '0.1.0',
    name: 'dop',
    
    // special keys
    specialkey: {
        socket_token: '~TOKEN_DOP',
        object_path: '~dop'
    },

    data: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{}
    },

    // src
    util:{},
    core:{},
    protocol:{},
    listener:{},
    connector:{},
    transport:{listen:{}, connect:{}}

};