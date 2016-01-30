'strict';

var syncio = { 
    version: '0.6.0',
    name: 'syncio',
    side: 'api',

    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$syncio_remote_function',

    util: {},
    on: {},
    _on: {},
    objects: {}
};



if ( typeof module == 'object' && module )
    module.exports = syncio;