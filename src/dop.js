

var dop = {
    version: '0.9.0',
    name: 'dop',
    port: 4444,

    // keys
    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$DOP_REMOTE_FUNCTION',

    // Api
    util:{},
    on:{},
    _on:{},
    listener:{},
    connector:{},

    // Data
    node_inc:0,
    node:{},
    object_inc:0,
    objects:{},
};


if ( typeof module == 'object' && module )
    module.exports = dop;