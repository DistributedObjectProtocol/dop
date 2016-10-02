(function(root) {

var dop = {

    version: '0.1.0',
    name: 'dop',
    
    // special properties
    specialprop: {
        socket_token: '~TOKEN_DOP',
        dop: '~dop'
    },

    // Where all the internal information is stored
    data: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        collectors:[],
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