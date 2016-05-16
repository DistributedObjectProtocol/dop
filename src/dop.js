
var dop = {

    version: '0.9.0',
    name: 'dop',
    port: 4444,
    
    // keys
    key_socket_token: '~TOKEN_DOP',
    key_object_path: '~PATH',

    name_remote_function: '$DOP_REMOTE_FUNCTION',
    encode_options: {
        encode_function: '~F',
        encode_undefined: '~U',
        encode_regexp: '~R',
    },

    // Data
    node_inc:0,
    node:{},
    object_inc:0,
    object:{},

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