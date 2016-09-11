
dop.core.proxyHandler = {
    set: function(target, prop, value) {
        console.log('PROXY SET!', target[dop.specialprop.dop], prop);
        target[prop] = value;
        return true;
    }
};
