
(function() {

var dop = {

    version: '0.1.0',
    name: 'dop',
    
    // special keys
    specialkey: {
        socket_token: '~TOKEN_DOP',
        object_path: '~PATH'
    },

    data: {
        node_inc:0,
        node:{},
        object_inc:0,
        object:{},
        object_onsubscribe:{}
    },

    // src
    util:{},
    core:{},
    protocol:{},
    listener:{},
    connector:{},
    transport:{listen:{}, connect:{}}


};