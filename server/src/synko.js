

module.exports = synko = {
    version: '0.7.3',
    name: 'synko',
    side: 'user',
    port: 4444,

    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$SYNKO_REMOTE_FUNCTION',

    util: {},
    on: {},
    _on: {},

    objects: {},
    user_inc: 0,
    object_inc: 0
};

