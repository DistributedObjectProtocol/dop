

module.exports = syncio = {
    version: '0.6.0',
    name: 'syncio',
    side: 'user',
    port: 4444,

    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    stringify_function: '~F',
    stringify_undefined: '~U',
    stringify_regexp: '~R',
    name_remote_function: '$syncio_remote_function',

    util: {},
    on: {},
    _on: {},

    objects: {},
    user_inc: 0,
    object_inc: 0
};

