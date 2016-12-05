// Factory
if (root === undefined)
    return dop;

// AMD
if (typeof define === 'function' && define.amd)
    define([], function() { return dop });

// Node
else if (typeof module == 'object' && module.exports)
    module.exports = dop;

// Browser
else if (window && typeof window == 'object')
    window.dop = dop;

else
    root.dop = dop;

})(this);