
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
        object_onsync:{}
    },

    // src
    util:{},
    core:{},
    protocol:{},
    listener:{},
    connector:{},

    // Adapters
    adapter: {
        nodejs: {listen:{},connect:{}},
        browser: {listen:{}, connect:{}}
    }


};


if ( typeof module == 'object' && module )
    module.exports = dop;