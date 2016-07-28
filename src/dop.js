
var dop = {

    version: '0.1.0',
    name: 'dop',
    
    // keys
    key_socket_token: '~TOKEN_DOP',
    key_object_path: '~PATH',

    name_remote_function: '$DOP_REMOTE_FUNCTION',
    encode_options: {
        encode_function: '~F',
        encode_undefined: '~U',
        encode_regexp: '~R',
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