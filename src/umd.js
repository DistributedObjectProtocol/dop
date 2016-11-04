// Factory
if (root === undefined)
    return dop;

// AMD
if (typeof define === 'function' && define.amd)
    define([], function() { return dop });

// Node
else if (typeof module == 'object' && module.exports)
    module.exports = dop;

// Browser (window)
else
    root.dop = dop;

})(this);