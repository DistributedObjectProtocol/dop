
dop.core.proxyHandler = {
    set: function(target, prop, value) {
        console.log('PROXY SET!', target[dop.specialkey.object_path], prop);
        target[prop] = value;
        return true;
    }
};
