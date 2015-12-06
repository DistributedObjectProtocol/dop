

module.exports = syncio = {
    version: '1.0.0',
    name: 'syncio',
    port: 4444,
    side: 'user',
    key_user_token: '~TOKEN',
    key_object_path: '~PATH',
    key_remote_function: '~F',
    on: {},
    _on: {},
    user_inc: 0,
    objects: {},
    object_inc: 0,
    remote: function() {
        return this.key_remote_function;
    },

};

