

dop.core.proxyHandler = {
    set: function(target, prop, value) {
        console.log('PROXY SET!', target[dop.key_object_path], prop);
        target[prop] = value;
        return true;
    }
};
