'strict';

var synko = { 
    version: '0.7.3',
    name: 'synko',
    side: 'api',

    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$SYNKO_REMOTE_FUNCTION',

    util: {},
    on: {},
    _on: {},
    objects: {}
};



if ( typeof module == 'object' && module )
    module.exports = synko;